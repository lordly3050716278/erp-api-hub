import type { Request, Response, NextFunction } from 'express'

module.exports = (req: Request, resp: Response, next: NextFunction) => {
    req.paramsInclude = function <T extends string>(...keys: T[]) {
        const params = this.method === 'GET' ? this.query : this.body

        const valid = {} as Record<T, any>
        const others: Omit<Record<string, any>, T> = {} as any

        for (const key of keys) {
            const value = params[key]
            if (value === undefined) throw new Error(`缺少参数 ${key}`)
            valid[key] = value
        }

        for (const key in params) {
            if (keys.includes(key as T)) continue
            (others as any)[key] = params[key]
        }

        return { valid, others }
    }

    req.paramsExclude = function <T extends string>(...keys: T[]) {
        const params = this.method === 'GET' ? this.query : this.body

        for (const key of keys) {
            const value = params[key]
            if (value !== undefined && value !== null) throw new Error(`存在不允许的参数 ${key}=${value}`)
        }
    }

    next()
}