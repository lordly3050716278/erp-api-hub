import type { Application, Router, Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'

/** 路由根目录路径 */
const DIR = path.join(__dirname, 'routes')

/**
 * 为指定 Router 实例中的所有路由处理函数添加异步错误捕获包装。
 *
 * Express 默认不会自动捕获 async/await 中的异常，  
 * 如果异步路由中 `throw new Error()`，应用不会自动进入全局错误处理中间件。  
 * 
 * 本函数通过遍历 Router 内部的 `stack`，  
 * 对每个 route 中的 handler 函数进行封装：
 * - 对同步错误使用 try/catch 捕获；
 * - 对返回 Promise 的异步函数添加 `.catch(next)`；
 * 
 * 从而确保任何同步或异步异常都能被正确传递给全局错误处理器。
 *
 * @param {Router} router - 需要进行错误捕获包装的 Express Router 实例。
 *
 * @example
 * const router = Router()
 * router.get('/demo', async (req, res) => {
 *   throw new Error('This will be caught!')
 * })
 * wrapRouterStack(router)
 */
function wrapRouterStack(router: Router): void {
    router.stack.forEach(layer => {
        if (!layer.route) return
        for (const stack of layer.route.stack) {
            const handler = stack.handle
            if (typeof handler === 'function') {
                stack.handle = function (req: Request, res: Response, next: NextFunction) {
                    try {
                        const ret = handler(req, res, next)
                        // 如果返回 Promise，则捕获异步异常
                        if (ret && typeof ret.then === 'function') {
                            ret.catch(next)
                        }
                    } catch (err) {
                        // 捕获同步异常
                        next(err)
                    }
                }
            }
        }
    })
}

/**
 * 自动扫描并注册指定目录下的所有路由模块。
 *
 * 支持的特性：
 * - 自动递归加载子目录；
 * - 支持 `.js` 与 `.ts` 文件；
 * - 自动拼接路由挂载路径（根据文件路径结构）；
 * - 自动为每个 Router 注入异步错误捕获；
 * - 自动输出路由注册成功日志；
 *
 * 文件规则：
 * - 每个路由文件需默认导出一个 `Express.Router` 实例；
 * - 目录结构映射为访问路径（`routes/admin/user.ts` → `/admin/user`）；
 * - `.ts` 或 `.js` 后缀会自动去除；
 * - 挂载路径前自动拼接 `process.env.CONTEXT_PATH`。
 *
 * @param {string} routesDir - 路由文件所在的根目录路径。
 * @param {Application} app - Express 应用实例。
 *
 * @example
 * // 项目结构:
 * // ├─ src/
 * // │  ├─ routes/
 * // │  │  ├─ user.ts
 * // │  │  └─ admin/
 * // │  │     └─ dashboard.ts
 * //
 * // 自动注册后访问路径:
 * // /user
 * // /admin/dashboard
 *
 * autoSetupRoute(path.join(__dirname, 'routes'), app)
 */
function autoSetupRoute(routesDir: string, app: Application): void {
    // 判断是否存在目录
    if (!fs.existsSync(routesDir)) {
        console.cliError(`${routesDir} 目录不存在`)
        process.exit(1)
    }

    // 读取所有文件或目录
    const fileOrDirs = fs.readdirSync(routesDir)

    // 遍历内容
    fileOrDirs.forEach(fileOrDir => {
        const fullPath = path.join(routesDir, fileOrDir)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
            // 递归加载子目录
            autoSetupRoute(fullPath, app)
            return
        }

        if (!stat.isFile()) return
        const suffix = path.extname(fileOrDir)
        if (!['.ts', '.js'].includes(suffix)) return

        // 加载模块
        const { default: router } = require(fullPath)

        // 自动为 Router 添加异步错误捕获
        wrapRouterStack(router)

        // 生成路由挂载路径
        const contextPath = process.env.CONTEXT_PATH + fullPath.replace(DIR, '')
            .replace('.ts', '')
            .replace('.js', '')
            .replaceAll('\\', '/')

        // 注册路由
        app.use(`${contextPath}`, router)
        console.cliSuccess(`${contextPath} 路由注册成功`)
    })
}

/**
 * Express 路由自动注册入口函数。
 *
 * 会自动扫描 `routes` 目录并注册所有路由模块，
 * 同时为每个路由模块添加异步错误捕获支持。
 *
 * @param {Application} app - Express 应用实例。
 */
module.exports = (app: Application) => autoSetupRoute(DIR, app)
