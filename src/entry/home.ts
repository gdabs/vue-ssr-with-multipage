import clientRender from '@/render/client-entry';
import serverRender from '@/render/server-entry';
import route from '@/router/home';
import { IConfig, ISSRContext } from '@/interface';

declare const module: any;

export default __isBrowser__
  ? (() => {
      clientRender(route);
      if (process.env.NODE_ENV === 'development') {
        module?.hot?.accept();
      }
    })()
  : async (ctx: ISSRContext, config: IConfig, manifest: { [key: string]: string;}) => {
      return serverRender(ctx, config, manifest, route);
    };
