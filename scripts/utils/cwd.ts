import * as fs from 'fs'
import { promises } from 'fs'
import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { UserConfig } from '../../src/interface/config';


const getCwd = () => {
  return resolve(process.cwd(), process.env.APP_ROOT ?? '')
}

const getFeDir = () => {
  return resolve(getCwd(), process.env.FE_ROOT ?? 'src')
}

const getUserConfig = (): UserConfig => {
  // 生产环境如果有 config.prod 则读取
  const isProd = process.env.NODE_ENV === 'production'
  const hasProdConfig = fs.existsSync(resolve(getCwd(), 'config.prod.js'))
  return require(resolve(getCwd(), isProd && hasProdConfig ? 'config.prod' : 'config'))
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



const execPromisify = promisify(exec)

export {
  getCwd,
  getFeDir,
  getUserConfig,
  getLocalNodeModules,
  processError,
  accessFile,
  execPromisify
}
