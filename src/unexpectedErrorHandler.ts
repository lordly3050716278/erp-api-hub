process.on('uncaughtException', (err) => {
    console.cliError('未捕获的异常（uncaughtException）:', err)
})

process.on('unhandledRejection', (reason, promise) => {
    console.cliError('未处理的Promise拒绝（unhandledRejection）:', reason)
})