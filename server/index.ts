import { resolve } from 'path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import cookie from 'koa-cookie';
import requestId from 'koa-requestid';
import Router from 'koa-router';
import koaStatic from 'koa-static';
import staticCache from 'koa-static-cache';

import { render } from './render';
import { getCwd } from '../scripts/utils';
import * as log from './helpers/log';
import { loadConfig } from '../scripts/utils';
import responseHandler from './middleware/responseHandler';

const defaultConfig = loadConfig();
const cwd = getCwd();

const startServer = async () => {
  const { isDev, serverPort, host } = defaultConfig;

  const app = new Koa();
  const router = new Router();

  isDev && app.use(logger());
  app.use(bodyParser());
  app.use(cookie());
  app.use(requestId());
  app.use(koaStatic(__dirname + '../build'))
  app.use(staticCache(resolve(cwd, `./build/server`),{
    maxAge: 365 * 24 * 60 * 60,
    gzip:true
  }));

  app.use(helmet());

  app.use(cors({
    exposeHeaders: ['X-Request-Id']
  }));

  app.use(responseHandler());

  router.get('/index', async (ctx, next) => {
    const stream = await render(ctx, defaultConfig);
    ctx.response.body = stream;
  })
  app.use(router.routes());
  
  app.listen(serverPort, host, () => {
    log.info(`API server listening on ${host}:${serverPort}, in ${ isDev ? 'development': 'production'}`);
  });
  app.on('error', err => log.error(`Unhandled exception occured. message: ${err.message}`));
}



export default startServer;
