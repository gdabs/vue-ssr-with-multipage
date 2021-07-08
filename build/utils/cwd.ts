import * as fs from 'fs';
import { resolve, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { UserConfig } from '@/interface/config';

const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '');
};

const getFeDir = () => {
  return resolve(getCwd(), process.env.FE_ROOT ?? 'src');
};

const getUserConfig = (): UserConfig => {
  // 生产环境如果有 config.prod 则读取
  const isProd = process.env.NODE_ENV === 'production';
  const hasProdConfig = fs.existsSync(resolve(getCwd(), '/config.prod.js'));
  return require(resolve(getCwd(), isProd && hasProdConfig ? 'config.prod' : 'config'));
};

const getEntry = (type: 'client'|'server'): {[key: string]: string} => {
  const cwd = getCwd();
  const entryPath = resolve(cwd, './src/entry');
  // const layoutPath = resolve(cwd, './src/layout/index.vue');
  const entrys = fs.readdirSync(entryPath)
  const entry = {}
  // if (type !== 'client') {
  //   entry['layout'] = layoutPath
  // }
  entrys.map(item => {
    const fileName = item.replace(/\.(js|ts)/, '')
    entry[fileName] = type === 'client' ? join(entryPath, fileName) : join(entryPath, item)
  })
  return entry
}

const execPromisify = promisify(exec);

export { getCwd, getFeDir, getUserConfig, getEntry, execPromisify };
