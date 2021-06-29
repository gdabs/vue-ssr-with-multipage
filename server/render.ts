import { resolve } from 'path';
import { getCwd, StringToStream } from '../build/utils';
import { renderToStream, renderToString } from '@vue/server-renderer';
import { ISSRContext, IConfig } from '@/interface';

const mergeStream = require('merge-stream');
const cwd = getCwd();

async function render<T = string>(ctx: ISSRContext, config?: IConfig): Promise<T> {
  const { isDev, chunkName, stream } = config;
  const isLocal = isDev || process.env.NODE_ENV !== 'production';
  const serverFile = resolve(cwd, `./dist/server/${chunkName}.server.js`);
  if (isLocal) {
    // clear cache in development environment
    delete require.cache[serverFile];
  }
  ctx.response.type = 'text/html';
  const serverRender = require(serverFile).default;

  const serverRes = await serverRender(ctx, config);

  return stream
    ? mergeStream(new StringToStream('<!DOCTYPE html>'), renderToStream(serverRes))
    : `<!DOCTYPE html>${await renderToString(serverRes)}`;
}

export { render };
