export const getEnv = () => {
    return document.location.origin === 'http://localhost:3000' ? 'dev' : 'prod'
}

export const getServerUrl = () => {
    return getEnv() === 'dev'
        ? 'http://localhost:3006'
        : 'https://mayo-server.herokuapps.com'
}
