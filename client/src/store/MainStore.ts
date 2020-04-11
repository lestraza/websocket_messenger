import { observable, action, runInAction } from 'mobx'
import link from '../images/silvio.jpg'
import { registerClient, loginClientReq, authClientReq } from '../requests'
import { Z_ASCII } from 'zlib'

export interface IUser {
    id: string
    name: string
    lastName: string
    avatarUrl: string
    isOnline: boolean
}

export interface IMessage {
    userId: string
    fullName: string
    text: string
    timeStamp: string
}

export interface IRegisterProps {
    name?: string
    lastname?: string
    email: string
    password: string
}

class MainStore {
    @observable
    public clientRegisterProps: IRegisterProps = {
        name: '',
        lastname: '',
        email: '',
        password: '',
    }

    @observable
    public client: IUser = {
        id: '',
        name: '',
        lastName: '',
        avatarUrl: '',
        isOnline: false,
    }

    @observable
    public users: IUser[] = []

    @observable
    public currentDialog: IMessage[] = []

    @observable
    public clientId: string = ''

    @observable
    public newMessage: string = ''

    @observable
    public modal: string = ''

    @observable
    public isAuthenticated: boolean = false

    @observable
    public isRegistered: boolean = false

    @observable
    public errorExistedEmail: string = ''

    @observable
    public errorAuthentication: string = ''

    @observable
    public isAuthenticatedByToken: boolean = false

    constructor() {
        this.authClient()
    }

    @action.bound
    public getContacts() {
        const newUser = {
            id: '35s4d354',
            name: 'Erjan',
            lastName: 'Egoev',
            avatarUrl: link,
            isOnline: true,
        }
        this.users = [...this.users, newUser]
    }

    @action.bound
    public saveInputValue(prop: keyof IRegisterProps, value: string) {
        this.clientRegisterProps[prop] = value
    }

    @action.bound
    public registerNewClient() {
        registerClient(this.clientRegisterProps)
            .then(() => {
                runInAction(() => {
                    this.clientRegisterProps = {
                        name: '',
                        lastname: '',
                        email: '',
                        password: '',
                    }
                    this.isRegistered = true
                })
            })
            .catch((err) => {
                runInAction(() => {
                    this.errorExistedEmail = err.message
                })
            })
    }

    @action.bound
    public clientLogin() {
        loginClientReq(this.clientRegisterProps)
            .then((res) => {
                runInAction(() => {
                    this.clientRegisterProps = {
                        email: '',
                        password: '',
                    }
                    this.clientId = res.id
                    this.authClient()
                })
            })
            .catch((err) => {
                runInAction(() => {
                    this.errorAuthentication = err.message
                })
            })
    }

    @action.bound
    public getCookie(name: string) {
        const decodeCookies: string[] = decodeURIComponent(
            document.cookie
        ).split(';')
        for (let i = 0; i < decodeCookies.length; i++) {
            let z = decodeCookies[i]
            while (z.charAt(0) == ' ') {
                z = z.substring(1)
            }
            if (z.indexOf(name) == 0) {
                return z.substring(name.length, z.length)
            }
        }
        return
    }

    @action.bound
    public authClient() {
        return new Promise((resolve, reject) => {
            const cookieName: string = 'user_token='
            const token: any = this.getCookie(cookieName)
            authClientReq(token)
                .then((res) => {
                    runInAction(() => {
                        this.client = {
                            id: res.id,
                            name: res.name,
                            lastName: res.lastname,
                            avatarUrl: res.avatarUrl,
                            isOnline: res.isOnline,
                        }
                        this.isAuthenticated = true
                        resolve()
                    })
                })
                .catch((err) => {
                    runInAction(() => {
                        this.isAuthenticated = false
                        reject()
                    })
                })
        })
    }

    @action.bound
    public logout() {
        let cookieName: string = 'user_token='
        const token: any = this.getCookie(cookieName)
        //cookieName = `${cookieName}${token}; Path=/`
        document.cookie = `${cookieName}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
        this.authClient()
    }

    @action.bound
    public sendMessage() {
        const dialogMessage: IMessage = {
            userId: this.clientId,
            fullName: 'Berjan Egoev',
            text: this.newMessage,
            timeStamp: new Date().toISOString(),
        }
        this.currentDialog = [...this.currentDialog, dialogMessage]
        this.newMessage = ''
    }

    @action.bound
    public saveNewMessage(message: string) {
        this.newMessage = message
    }
}
export default MainStore
