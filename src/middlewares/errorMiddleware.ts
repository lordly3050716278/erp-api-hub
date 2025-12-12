import type { Request, Response, NextFunction } from 'express'

module.exports = (error: any, req: Request, resp: Response, next: NextFunction) => {

    // 如果响应头已经发出，交给 Express 默认处理
    if (resp.headersSent) {
        return next(error)
    }

    // 如果有自定义的失败处理函数，则调用
    if (resp.fail) {
        return resp.fail(error)
    }

    const status = error.status || error.statusCode || 500

    resp.status(status).json({
        success: false,
        message: error.message || '服务器内部错误',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
}