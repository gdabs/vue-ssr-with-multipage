import * as fs from 'fs'
import { promises } from 'fs'
import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { UserConfig, IPlugin } from './types/config';


const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '')
}

const getFeDir = () => {
  return resolve(getCwd(), process.env.FE_ROOT ?? 'web')
}

const getUserConfig = (): UserConfig => {
  // 生产环境如果有 config.prod 则读取
  const isProd = process.env.NODE_ENV === 'production'
  const hasProdConfig = fs.existsSync(resolve(getCwd(), 'config.prod.js'))
  return require(resolve(getCwd(), isProd && hasProdConfig ? 'config.prod' : 'config'))
}

const loadPlugin = (): IPlugin => {
  const plugin = require(resolve(getCwd(), 'plugin'))
  console.log(getCwd(), plugin)
  return plugin
}

const isFaaS = async (fun?: boolean) => {
  const result = await promises.access(resolve(getCwd(), fun ? 'template.yml' : 'f.yml'))
    .then(() => true)
    .catch(() => false)
  return result
}

const getLocalNodeModules = () => resolve(__dirname, '../../../')

const processError = (err: any) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
}
const accessFile = async (file: string) => {
  const result = await promises.access(file)
    .then(() => true)
    .catch(() => false)
  return result
}

// let { prefix } = loadConfig()

// if (prefix && !prefix.startsWith('/')) {
//   prefix = `/${prefix}`
// }

// export const normalizePath = (path: string) => {
//   path = path.replace(prefix!, '')
//   if (path.startsWith('//')) {
//     path = path.replace('//', '/')
//   }
//   if (!path.startsWith('/')) {
//     path = `/${path}`
//   }
//   return path
// }


const execPromisify = promisify(exec)

export {
  getCwd,
  getFeDir,
  getUserConfig,
  isFaaS,
  loadPlugin,
  getLocalNodeModules,
  processError,
  accessFile,
  execPromisify
}
