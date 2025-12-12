// jsly.d.ts
declare module 'jsly' {
    /**
     * 防抖函数
     * @param fn 需要防抖执行的函数
     * @param delay 延迟毫秒数
     * @returns 包装后的防抖函数
     */
    export function debounce<T extends (...args: any[]) => any>(
        fn: T,
        delay: number
    ): (...args: Parameters<T>) => void

    /**
     * 节流函数
     * @param fn 需要节流执行的函数
     * @param delay 延迟毫秒数
     * @returns 包装后的节流函数
     */
    export function throttle<T extends (...args: any[]) => any>(
        fn: T,
        delay: number
    ): (...args: Parameters<T>) => void

    /**
     * 计算字符串的 SHA-256 哈希值
     * @param input 输入字符串
     * @returns 64位哈希字符串
     */
    export function sha256(input: string): string

    /**
     * 生成 UUID 并计算其 SHA-256 哈希
     * @param version UUID 版本，可选值：'v1' | 'v2' | 'v3' | 'v4' | 'v5'
     * @returns 哈希字符串
     */
    export function randomHash(version?: 'v1' | 'v2' | 'v3' | 'v4' | 'v5'): string

    /**
     * 生成基于浏览器信息的唯一指纹 ID（SHA-256 哈希）
     * @returns 浏览器唯一标识字符串
     */
    export function generateBrowserId(): string

    /**
     * 将对象转换为 FormData
     * @param obj 任意对象
     * @returns FormData 实例
     */
    export function buildObjFormData(obj: Record<string, any>): FormData

    /**
     * 智能复制文本到剪贴板（自动选择最佳方案）
     * @param text 要复制的文本
     * @returns Promise<void>
     */
    export function copyToClipboard(text: string): Promise<void>

    /**
     * 使用 Clipboard API 复制文本
     * @param text 要复制的文本
     * @returns Promise<void>
     */
    export function copyByClipboardAPI(text: string): Promise<void>

    /**
     * 使用 document.execCommand 复制文本（兼容旧浏览器）
     * @param text 要复制的文本
     * @returns Promise<void>
     */
    export function copyByExecCommand(text: string): Promise<void>

    /**
     * 小驼峰转下划线
     * @param str 小驼峰格式字符串
     * @returns 下划线格式字符串
     */
    export function camelToSnake(str: string): string

    /**
     * 下划线转小驼峰
     * @param str 下划线格式字符串
     * @returns 小驼峰格式字符串
     */
    export function snakeToCamel(str: string): string

    /**
     * 在 camelCase 与 snake_case 之间自动切换
     * @param str 输入字符串
     * @returns 转换后的字符串
     */
    export function toggleConvertCase(str: string): string

    /**
    * 转换对象的键名格式（支持可选递归）
    *
    * @param obj - 需要转换的对象（仅支持普通对象类型）
    * @param targetType - 目标格式：'camel' 转小驼峰；'snake' 转下划线
    * @param deep - 是否递归转换（默认 false，仅转换首层）
    * @returns 转换后的新对象
    *
    * @example
    * convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel')
    * // => { userName: 'Tom', userInfo: { phone_number: '123' } }
    *
    * @example
    * convertKeys({ user_name: 'Tom', user_info: { phone_number: '123' } }, 'camel', true)
    * // => { userName: 'Tom', userInfo: { phoneNumber: '123' } }
    *
    * @example
    * convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake')
    * // => { user_name: 'Tom', user_info: { phoneNumber: '123' } }
    *
    * @example
    * convertKeys({ userName: 'Tom', userInfo: { phoneNumber: '123' } }, 'snake', true)
    * // => { user_name: 'Tom', user_info: { phone_number: '123' } }
    */
    export function convertKeys<T extends Record<string, any>>(
        obj: T,
        targetType: 'camel' | 'snake',
        deep?: boolean
    ): Record<string, any>


    /**
     * 对象浅层差异对比
     * @param oldObj 旧对象
     * @param newObj 新对象
     * @returns 包含差异键的新对象
     */
    export function shallowDiff<T extends Record<string, any>>(
        oldObj: T,
        newObj: T
    ): Partial<T>

    /**
     * 对象深层差异对比
     * @param oldObj 旧对象
     * @param newObj 新对象
     * @param minimal 是否返回最小差异对象（默认 false）
     * @returns 差异对象
     */
    export function deepDiff<T extends Record<string, any>>(
        oldObj: T,
        newObj: T,
        minimal?: boolean
    ): Partial<T>

    /**
     * 简易事件总线
     */
    export const $bus: {
        /**
         * 监听事件
         * @param event 事件名
         * @param listener 监听函数
         */
        on(event: string, listener: (...args: any[]) => void): void

        /**
         * 监听一次性事件
         * @param event 事件名
         * @param listener 监听函数
         */
        once(event: string, listener: (...args: any[]) => void): void

        /**
         * 触发事件
         * @param event 事件名
         * @param payload 参数
         */
        emit(event: string, payload?: any): void

        /**
         * 移除特定事件监听器
         * @param event 事件名
         * @param listener 监听函数
         */
        off(event: string, listener: (...args: any[]) => void): void

        /**
         * 移除所有监听器
         */
        removeAllListeners(): void
    }


    /**
     * 高亮文本中的关键词。
     *
     * @function highlightKeyword
     * @description
     * 在给定的文本中查找所有匹配的关键词（不区分大小写），并使用带样式的
     * HTML 标签（默认 `<span>`）包裹，使其以高亮方式显示。该方法适用于搜索
     * 结果展示、文本匹配提示等场景。
     *
     * @param {string} text - 原始完整文本。
     * @param {string} keyword - 需要高亮显示的关键词。如果为空，则直接返回原文本。
     * @param {Object} [config] - 配置对象，用于自定义高亮标签和样式。
     * @param {string} [config.tag="span"] - 包裹关键词的 HTML 标签名。
     * @param {string} [config.bgColor="#ff0"] - 高亮背景颜色。
     * @param {string} [config.color="#001"] - 关键词文字颜色。
     *
     * @returns {string} 返回插入带样式标签后的 HTML 字符串。
     *
     * @example
     * highlightKeyword(
     *   "泡泡音乐是一款好用的播放器",
     *   "音乐"
     * )
     * // => '泡泡<span style="background-color: #ff0;color: #001;">音乐</span>是一款好用的播放器'
     */
    export function highlightKeyword(
        text,
        keyword,
        config = { tag: "span", bgColor: "#ff0", color: "#001" }
    ) {
        if (!keyword) return text

        const { tag, bgColor, color } = config
        const pattern = new RegExp(escapeRegExp(keyword), "gi")
        const style = `background-color: ${bgColor};color: ${color};`

        return text.replace(pattern, (match) => `<${tag} style="${style}">${match}</${tag}>`)
    }

}
