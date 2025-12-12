namespace NodeJS {
    interface ProcessEnv {
        /**
        * 当前环境模式，可选值为 'development' 或 'production'
        */
        NODE_ENV: 'development' | 'production'

        /**
         * 服务器端口号
         */
        PORT: number

        /**
         * 应用上下文路径
         */
        CONTEXT_PATH: string

        /** excel 导出的目录 */
        EXCEL_PATH: string

        /** 表格访问上下文 */
        EXCEL_CONTEXT_PATH: string

        /** 表格静态资源访问 URL */
        EXCEL_URL: string
    }
}