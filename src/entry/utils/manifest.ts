import { join, resolve } from 'path'
import axios from 'axios';
import { IConfig } from '@/interface';

let manifest: {
  [key: string]: string
} = {}

const getManiFest = async (config: IConfig) => {
  const { isDev, fePort, https } = config;

  if (Object.keys(manifest).length !== 0) {
    return
  }
  const cwd = resolve(process.cwd(), process.env.APP_ROOT ?? '');
  if (isDev) {
    const res = await axios.get(`${https ? 'https' : 'http'}://localhost:${fePort}/asset-manifest.json`)
    manifest = res.data
  } else {
    manifest = require(join(cwd, './build/client/asset-manifest.json'))
  }
}
const getManifest = async (config: IConfig) => {
  await getManiFest(config);
  return manifest;
}

export {
  getManifest
}