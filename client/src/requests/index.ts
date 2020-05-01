import { IMessage } from './../components/Mainchatpage/Dialog/store/Dialog.interface'
import { IUser } from './../components/Auth/store/Auth.interface'
import { IChangeSettingsProps } from './../components/Mainchatpage/SettingsBar/store/Settings.store'

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
    contacts: []
}

export interface ISaveProfilePhotoResponse {
    avatarUrl: string
    _id: string
}

export function registerClient(clientData: IUser) {
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

export function loginClientReq(clientData: IUser) {
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

export function authClientReq(token: string) {
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

export function addProfilePhotoReq(data: FormData) {
    return new Promise<string>((resolve, reject) => {
        return fetch('/api/users/addAvatar', {
            method: 'POST',
            body: data,
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
    return new Promise<string>((resolve, reject) => {
        return fetch('/api/users/saveAvatar', {
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

export interface IContactResponse {
    id: string
    name: string
    lastname: string
    email: string
    avatarUrl?: string
    hasNewMessage?: boolean
}

export function getContactById(contactId: string) {
    return new Promise<IContactResponse>((res, rej) => {
        return fetch(`/api/users/getContactById?contactId=${contactId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((parsedRes: IContactResponse) => {
                res(parsedRes)
            })
            .catch((err) => {
                rej(err)
            })
    })
}

//////////////////////////////////
/////    ADD CONTACTS
//////////////////////////////////
export interface IAddContactProps {
    clientId: string
    contactId: string
    //contactId: string
}

export interface IFindContactResponse {
    id: string
    avatarUrl: string
    name: string
    lastname: string
}

export interface IFindContactProps {
    email: string
}

export function findContactReq(email: string) {
    return new Promise<IFindContactResponse>((resolve, reject) => {
        return fetch('/api/users/findContact', {
            method: 'POST',
            body: JSON.stringify({ email }),
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

export function addContactReq(data: IAddContactProps) {
    return new Promise<IContactResponse>((resolve, reject) => {
        return fetch('/api/users/addContact', {
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
export interface IDialogResponse {
    messages: IMessage[]
}
export function findDialogById(dialogId: string) {
    return new Promise<IDialogResponse>((res, rej) => {
        return fetch(`/api/users/getDialogById?dialogId=${dialogId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((parsedRes: IDialogResponse) => {
                res(parsedRes)
            })
            .catch((err) => {
                rej(err)
            })
    })
}

export interface IContact {
    contactId: string
    dialogId: string
}

export function deleteContactReq(data: IAddContactProps) {
    return new Promise<IContact[]>((resolve, rej) => {
        return fetch('/api/users/deleteContact', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((parsedRes) => {
                resolve(parsedRes)
            })
            .catch((err) => {
                rej(err)
            })
    })
}
