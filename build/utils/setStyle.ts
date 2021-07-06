// import { join } from 'path';
import * as WebpackChain from 'webpack-chain';
// import { decl } from 'postcss';
import { StyleOptions } from '@/interface/config';
import { loadConfig } from './loadConfig';
// import { getCwd } from './cwd';

// const cwd = getCwd();

// function wapSprites(rule, comment, image) {
//   //百分比
//   const backgroundSizes = image.spriteWidth / 100;
//   let backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
//   let backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

//   backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
//   backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

//   function format(num: number) {
//       return num < 10 ? '0' + num : `${num}`;
//   };
//   const date = new Date(),
//       year = date.getFullYear(),
//       month = format(date.getMonth() + 1),
//       day = format(date.getDate()),
//       hour = format(date.getHours()),
//       currentTime = year + month + day + hour;

//   const backgroundImage = decl({
//       prop: 'background-image',
//       value: 'url(' + image.spriteUrl + '?v=' + currentTime + ')'
//   });

//   const backgroundRepeat = decl({
//       prop: 'background-repeat',
//       value: 'no-repeat'
//   });

//   const backgroundSize = decl({
//       prop: 'background-size',
//       value: backgroundSizes + 'rem'
//   });

//   const backgroundPosition = decl({
//       prop: 'background-position',
//       value: backgroundPositionX + '% ' + backgroundPositionY + '%'
//   });

//   rule.insertAfter(comment, backgroundImage);
//   rule.insertAfter(backgroundImage, backgroundPosition);
//   rule.insertAfter(backgroundPosition, backgroundSize);
//   rule.insertAfter(backgroundPosition, backgroundRepeat);
//   // 百分比end
// }


// //雪碧图相关代码
// // ----------合并雪碧图函数-----------
// var spriteHooks = function () {
//   return {
//       onUpdateRule: wapSprites,
//       onSaveSpritesheet: function (opts, spritesheet) {
//           var url = Object.keys(spritesheet.coordinates)[0];
//           var imageUrl = url.replace(/\\/g, '\/');
//           var spritePath = imageUrl.slice(0, imageUrl.indexOf('/sprite'));
//           var filenameChunks = spritesheet.groups.concat(spritesheet.extension);

//           return join(spritePath, 'spr_' + filenameChunks.join('.'));
//       }
//   }
// }

const setStyle = (chain: WebpackChain, reg: RegExp, options: StyleOptions, isReact?: boolean) => {
  const { css, isDev } = loadConfig();
  const { include, exclude, modules, importLoaders, loader } = options;
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const loadModule = require.resolve;

  const userCssloaderOptions = css?.().loaderOptions?.cssOptions ?? {};
  const cssloaderOptions = {
    importLoaders: importLoaders,
    modules: modules,
  };
  if (isReact) {
    // @ts-expect-error
    cssloaderOptions.localIdentName = '[name]__[local]___[hash:base64:5]';
  }
  Object.assign(cssloaderOptions, userCssloaderOptions);

  const postCssPlugins = css?.().loaderOptions?.postcss?.plugins ?? []; // 用户自定义 postcss 插件
  const postCssOptions = Object.assign(
    {
      ident: 'postcss',
      plugins: () =>
        [
          require('postcss-opacity'),
          require('postcss-assets')({
            cachebuster: true,
          }),
          require('postcss-color-rgba-fallback')({
            properties: ["background-color", "background", "color", "border", "border-color", "outline", "outline-color", "box-shadow"]
          }),
          require('postcss-px2rem-exclude')({
            remUnit: 100,
            exclude: /node_modules|folder_name/i
          }),
          // require('postcss-sprites')({
          //   retina: false,//支持retina，可以实现合并不同比例图片
          //   verbose: true,//Prints the plugin output to the console.
          //   basePath: join(cwd, './static'),
          //   spritePath: './', //雪碧图合并后存放地址，默认为./
          //   stylesheetPath: null,//样式的位置，默认为null
          //   spritesmith: {
          //       padding: 8,
          //       algorithm: 'binary-tree' //binary-tree, top-down, left-right, diagonal,alt-diagonal
          //   },
          //   filterBy: function (image) {
          //       //过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
          //       if (image.url.indexOf('/sprite/') === -1) {
          //           return Promise.reject();
          //       }
          //       return Promise.resolve();
          //   },
          //   groupBy: function (image) {
          //       //将图片分组，可以实现按照文件夹生成雪碧图
          //       var name = /\/sprite\/([0-9.A-Za-z\-\_]+)\//.exec(image.url);//取目录名称sprite和后面的目录名称
          //       if (!name) {
          //           return Promise.reject(new Error('Not a shape image.'));
          //       }
          //       return Promise.resolve(name[1]);
          //   },
          //   hooks: spriteHooks()
          // }),
          require('postcss-flexbugs-fixes'),
          require('postcss-discard-comments'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ].concat(postCssPlugins),
    },
    css?.().loaderOptions?.postcss?.options ?? {}
  ); // 合并用户自定义 postcss options

  chain.module
    .rule(options.rule)
    .test(reg)
    .when(Boolean(include), rule => {
      include && rule.include.add(include).end();
    })
    .when(Boolean(exclude), rule => {
      exclude && rule.exclude.add(exclude).end();
    })
    .when(isDev, rule => {
      rule.use('hmr').loader(loadModule('css-hot-loader')).end();
    })
    .use('MiniCss')
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use('css-loader')
    .loader(loadModule('css-loader'))
    .options(cssloaderOptions)
    .end()
    .use('postcss-loader')
    .loader(loadModule('postcss-loader'))
    .options(postCssOptions)
    .end()
    .when(Boolean(loader), rule => {
      loader &&
        rule
          .use(loader)
          .loader(loadModule(loader))
          .when(loader === 'less-loader', rule => {
            rule.options(
              css?.().loaderOptions?.less ?? {
                lessOptions: {
                  javascriptEnabled: true,
                },
              }
            );
          })
          .when(loader === 'sass-loader', rule => {
            rule.options(css?.().loaderOptions?.sass ?? {});
          })
          .end();
    });
};

export { setStyle };
