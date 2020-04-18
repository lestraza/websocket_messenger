import { IChangeSettingsProps } from './../components/Mainchatpage/SettingsBar/store/Settings.store'
import { IRegisterProps } from './../components/Auth/store/Auth.interface'

export interface IRegisterResponse {
    success: string
}
export interface ILoginResponse {
    success: string
    id: string
}
export interface IAuthResponse {
    success: string
    isOnline: boolean
    id: string
    email: string
    name: string
    lastname: string
    avatarUrl: string
    dialogs: []
}

export interface ISaveProfilePhotoResponse {
    avatarUrl: any
    _id: string
}

export function registerClient(clientData: IRegisterProps) {
    return new Promise<IRegisterResponse>((resolve, reject) => {
        return fetch('/api/users/register', {
            method: 'POST',
            body: JSON.stringify(clientData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            res.json().then((parsedRes) => {
                if (res.status === 200) {
                    resolve(parsedRes)
                } else {
                    reject(parsedRes)
                }
            })
        })
    })
}

export function loginClientReq(clientData: IRegisterProps) {
    return new Promise<ILoginResponse>((resolve, reject) => {
        return fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(clientData),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            res.json().then((parsedRes) => {
                if (res.status === 200) {
                    resolve(parsedRes)
                } else {
                    reject(parsedRes)
                }
            })
        })
    })
}

export function authClientReq(token: IAuthResponse) {
    return new Promise<IAuthResponse>((resolve, reject) => {
        return fetch('/api/users/auth', {
            method: 'POST',
            body: JSON.stringify({ token }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            res.json().then((parsedRes) => {
                if (res.status === 200) {
                    resolve(parsedRes)
                } else {
                    reject(parsedRes)
                }
            })
        })
    })
}

export function saveProfilePhotoReq(data: ISaveProfilePhotoResponse) {
    return new Promise<ISaveProfilePhotoResponse>((resolve, reject) => {
        return fetch('/api/users/addAvatar', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            res.json().then((parsedRes) => {
                if (res.status === 200) {
                    resolve(parsedRes)
                } else {
                    reject(parsedRes)
                }
            })
        })
    })
}

export function updateClientSettings(data: IChangeSettingsProps) {
    return new Promise<IChangeSettingsProps>((resolve, reject) => {
        return fetch('/api/users/updateClient', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            res.json().then((parsedRes) => {
                if (res.status === 200) {
                    resolve(parsedRes)
                } else {
                    reject(parsedRes)
                }
            })
        })
    })
}
