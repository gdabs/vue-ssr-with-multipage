import fs from 'fs';
import { resolve } from 'path';
import { getCwd } from './cwd';

const cwd = getCwd();
const dotenv = resolve(cwd, `./env/.env`);

const FRONT_ENV = process.env.NODE_ENV || 'development';

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  // loaded in during build in docker
  `${dotenv}.${FRONT_ENV}`,
  dotenv,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});



// Grab NODE_ENV and VUE_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const REACT_APP = /^(VUE_APP_|runtime)/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        // We support configuring the sockjs pathname during development.
        // These settings let a developer run multiple simultaneous projects.
        // They are used as the connection `hostname`, `pathname` and `port`
        // in webpackHotDevClient. They are used as the `sockHost`, `sockPath`
        // and `sockPort` options in webpack-dev-server.
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
        // Whether or not react-refresh is enabled.
        // react-refresh is not 100% stable at this time,
        // which is why it's disabled by default.
        // It is defined here so it is available in the webpackHotDevClient.
        FAST_REFRESH: process.env.FAST_REFRESH !== 'false',
      }
    );
  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

export { getClientEnvironment };