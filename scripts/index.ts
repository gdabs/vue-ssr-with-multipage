#!/usr/bin/env node
import { resolve } from 'path';
import { fork } from 'child_process';
import * as yargs from 'yargs';
import { loadConfig } from './utils/loadConfig';
import { Argv } from '../src/interface/config';
import startClient from './start';
import buildClient from './build';
import startServer from '../server';

const spinnerProcess = fork(resolve(__dirname, './spinner')); // 单独创建子进程跑 spinner 否则会被后续的 require 占用进程导致 loading 暂停
const debug = require('debug')('ssr:cli');
const start = Date.now();
const spinner = {
  start: () =>
    spinnerProcess.send({
      message: 'start',
    }),
  stop: () =>
    spinnerProcess.send({
      message: 'stop',
    }),
};

yargs
  .command('start', 'Start Server', {}, async (argv: Argv) => {
    spinner.start();
    process.env.BUILD_TOOL = 'webpack';
    process.env.NODE_ENV = 'development';

    const { https } = loadConfig();

    if (https) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    if (argv.test) {
      // 开发同学本地 link 测试用
      process.env.TEST = '1';
    }
    debug(`require ssr-server-utils time: ${Date.now() - start} ms`);
    debug(`loadPlugin time: ${Date.now() - start} ms`);
    spinner.stop();
    await startClient(argv);
    debug(`clientPlugin ending time: ${Date.now() - start} ms`);
    await startServer();
    debug(`serverPlugin ending time: ${Date.now() - start} ms`);
  })
  .command('build', 'Build server and client files', {}, async (argv: Argv) => {
    spinner.start();
    process.env.NODE_ENV = 'production';

    spinner.stop();

    await buildClient(argv);
    // await plugin.serverPlugin?.build?.(argv);
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .option('version', {
    alias: 'v',
    default: false,
  })
  .fail((msg, err) => {
    if (err) {
      console.log(err);
      spinner.stop();
      process.exit(1);
    }
    console.log(msg);
  })
  .parse();
