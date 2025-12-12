import type { Request, Response, NextFunction } from 'express'

class HttpResponse {
    code: number
    msg: string
    data: any

    constructor(code: number, msg: string, data?: any) {
        this.code = code
        this.msg = msg
        this.data = data
    }
}

module.exports = (req: Request, resp: Response, next: NextFunction) => {
    resp.success = function (msg, data) {
        this.body = new HttpResponse(200, msg, data)
        this.send(this.body)
    }

    resp.fail = function (error) {
        console.cliError(error)
        this.body = new HttpResponse(400, error.message)
        this.send(this.body)
    }

    resp.authFail = function (error) {
        console.cliError(error)
        this.body = new HttpResponse(401, error.message)
        this.send(this.body)
    }

    next()
}