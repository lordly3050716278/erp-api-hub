import express from 'express'
import cors from 'cors'

// 重写console的方法
import './console'
// 加载环境变量
import './env'
// 处理全局错误
import './unexpectedErrorHandler'

const app = express()

console.cliLog('跨域处理')
app.use(cors())

console.cliLog('解析JSON的请求体')
app.use(express.json({ limit: '200mb' }))

console.cliLog('解析URL编码的数据')
app.use(express.urlencoded({ extended: true, limit: '200mb' }))

console.cliLog('表格静态资源服务')
app.use(process.env.EXCEL_CONTEXT_PATH, express.static(process.env.EXCEL_PATH))

app.use(require('@/middlewares/responseMiddleware'))
app.use(require('@/middlewares/parameterMiddlewares'))

console.cliLog('注册路由')
require('./router')(app)

app.use(require('@/middlewares/errorMiddleware'))

const { PORT } = process.env
app.listen(PORT, () => {
    console.cliSuccess(`服务已运行在 ${PORT}`)
})