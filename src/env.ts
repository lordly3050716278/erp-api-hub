import path from 'path'
import dotenv from 'dotenv'

console.cliLog('开始加载环境变量')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development'
}
const CURR_ENV = process.env.NODE_ENV
console.cliLog(`当前环境 ${CURR_ENV}`)

const baseEnvPath = path.join(__dirname, '..', `.env`)
const envPath = path.join(__dirname, '..', `.env.${CURR_ENV}`)

try {
    dotenv.config({ path: baseEnvPath })
    dotenv.config({ path: envPath })

    process.env.EXCEL_PATH = path.join(process.cwd(), 'excels')

    const isDev = CURR_ENV === 'development'

    const { BASE_URL, PORT, CONTEXT_PATH } = process.env

    const EXCEL_CONTEXT_PATH = CONTEXT_PATH + '/excel'
    process.env.EXCEL_CONTEXT_PATH = EXCEL_CONTEXT_PATH

    process.env.EXCEL_URL = isDev ? `${BASE_URL}:${PORT}${EXCEL_CONTEXT_PATH}` : `${BASE_URL}${EXCEL_CONTEXT_PATH}`

    console.cliSuccess(`加载 [${envPath}] 成功`)
} catch (error) {
    console.cliError(`加载 [${envPath}] 失败: ${error}`)
    process.exit(1)
} 