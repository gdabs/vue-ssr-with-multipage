import { join } from 'path';
import axios from 'axios';
import { IConfig } from '@/interface';

let manifest: {
  [key: string]: string;
} = {};

const getManiFest = async (config: IConfig, cwd: string) => {
  const { isDev, fePort, https } = config;

  if (Object.keys(manifest).length !== 0) {
    return;
  }
  if (isDev) {
    const res = await axios.get(
      `${https ? 'https' : 'http'}://localhost:${fePort}/asset-manifest.json`
    );
    manifest = res.data;
  } else {
    const manifestFile = join(cwd, `./dist/client/asset-manifest.json`);
    console.log(manifestFile, 'manifestFile')
    manifest = require(manifestFile);
    console.log(manifest, 'manifest')
  }
};
const getManifest = async (config: IConfig, cwd: string) => {
  await getManiFest(config, cwd);
  return manifest;
};

export { getManifest };
