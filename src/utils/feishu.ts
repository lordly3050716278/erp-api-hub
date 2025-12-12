import axios from 'axios'

/** axios请求基础配置 config */
const AXIOS_BASE_CONFIG = {
    headers: {
        'Secret-Key': 'e9afabcd61d999c079a9018ffdc27ae0'
    }
}

/** 广播消息 */
export async function broadcastFeiShuMessage(message: string, broadcastUserIds: number[]) {
    const url = 'https://saas.mc0574.com/index.php/app/operation/flexPatio/broadcastMessage'
    const data = {
        broadcastUserIds,
        message
    }
    await axios.post(url, data, AXIOS_BASE_CONFIG)
}