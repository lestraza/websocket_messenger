import { IMessage } from './../../Mainchatpage/Dialog/store/Dialog.interface'
import { DialogStore } from './../../Mainchatpage/Dialog/store/Dialog.store'
import { IUser } from './Auth.interface'
import { AbstractStore } from './../../../store/Abstract.store'
import {
    saveProfilePhotoReq,
    addProfilePhotoReq,
    ISaveProfilePhotoResponse,
} from './../../../requests/index'
import { action, observable, runInAction, reaction } from 'mobx'
import {
    registerClient,
    loginClientReq,
    authClientReq,
    updateClientSettings,
} from '../../../requests'
import io from 'socket.io-client'

export class AuthStore extends AbstractStore {
    @observable
    public isAuthorizing: boolean = false

    @observable
    public socket?: SocketIOClient.Socket

    @observable
    public clientRegisterProps: IUser = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        avatarUrl: '',
    }

    @observable
    public client: IUser = {
        id: '',
        name: '',
        lastname: '',
        email: '',
        avatarUrl: '',
        contacts: [],
        isOnline: false,
    }

    @observable
    public authStoreServerSuccess: string = ''

    @observable
    public isAuthenticated: boolean = false

    @observable
    public isRegistered: boolean = false

    @observable
    public clientId: string = ''

    @observable
    public serverError: string = ''

    @observable
    public isAuthenticatedByToken: boolean = false

    @observable
    newSettings: IUser = {}

    @observable
    public isShowSettingsBar: boolean = false

    private get dialogStore() {
        return this.mainStore.getStore('dialogStore') as DialogStore
    }

    constructor() {
        super()

        this.isAuthorizing = true
        this.authClient().finally(() => {
            runInAction(() => {
                this.isAuthorizing = false
            })
        })

        reaction(
            () => this.client,
            () => {
                this.newSettings = { ...this.client }
            }
        )
    }

    @action.bound
    public saveInputValueRegisterForm(prop: keyof IUser, value: string) {
        if (prop) {
            ;(this.clientRegisterProps[prop] as string) = value
        }
    }

    @action.bound
    public registerNewClient() {
        this.serverError = ''
        return registerClient(this.clientRegisterProps)
            .then(() => {
                runInAction(() => {
                    this.clientRegisterProps = {
                        name: '',
                        lastname: '',
                        email: '',
                        password: '',
                        avatarUrl: '',
                    }
                    this.isRegistered = true
                })
            })
            .catch((err) => {
                runInAction(() => {
                    this.serverError = err.error
                })
            })
    }

    @action.bound
    public clientLogin() {
        this.serverError = ''
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
                    this.serverError = err.error
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
            while (z.charAt(0) === ' ') {
                z = z.substring(1)
            }
            if (z.indexOf(name) === 0) {
                return z.substring(name.length, z.length)
            }
        }
        return
    }

    @action.bound
    public authClient() {
        const cookieName: string = 'user_token='
        const token: any = this.getCookie(cookieName)
        return authClientReq(token)
            .then((res) => {
                runInAction(() => {
                    this.client = {
                        id: res.id,
                        name: res.name,
                        lastname: res.lastname,
                        email: res.email,
                        avatarUrl: res.avatarUrl,
                        contacts: res.contacts,
                        isOnline: res.isOnline,
                    }
                    this.isAuthenticated = true
                    this.dialogStore.getContactsById()
                    this.connectSocket()
                })
            })
            .catch((err) => {
                runInAction(() => {
                    this.isAuthenticated = false
                    this.socket?.emit('disconnect')
                })
            })
    }

    @action.bound
    private connectSocket() {
        this.socket = io('http://localhost:3006/', {
            query: {
                id: this.client.id,
            },
        })

        this.socket.on('connect', () => {
            console.log('connected')
        })
        this.socket.on('receiveMessage', (dialogMessage: IMessage) => {
            const { currentDialog } = this.dialogStore
            currentDialog.push(dialogMessage)
        })
        this.socket.on('inviteToChat', (id: string) => {
            const { sendNotification } = this.dialogStore
            sendNotification(id)
        })
    }

    @action.bound
    public logout() {
        let cookieName: string = 'user_token='
        document.cookie = `${cookieName}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
        this.authClient()
    }

    @action.bound
    public showOrCloseSettingsBar() {
        if (this.isShowSettingsBar) {
            this.isShowSettingsBar = false
        } else {
            this.isShowSettingsBar = true
        }
    }

    @action.bound
    public changeProfilePhoto(target: any) {
        const data = new FormData()
        data.append('file', target.files[0])

        addProfilePhotoReq(data).then((avatarUrl) => {
            const _id = this.client.id || ''
            const data: ISaveProfilePhotoResponse = {
                avatarUrl,
                _id,
            }
            saveProfilePhotoReq(data)
                .then(() => {                    
                    runInAction(() => {
                        this.client.avatarUrl = avatarUrl                        
                    })
                })
                .catch()
        })
    }

    @action.bound
    public saveInputValueNewSettingsForm(prop: keyof IUser, value: string) {
        ;(this.newSettings[prop] as string) = value
    }

    @action.bound
    public submutNewSettings() {
        this.newSettings.id = this.client.id        
        updateClientSettings(this.newSettings)
            .then((res) => {
                runInAction(() => {
                    this.authClient()
                    this.authStoreServerSuccess = "Your new settings were successfully updated!"
                })
            })
            .catch((err) => {
                runInAction(() => {
                    this.serverError = err.error
                })
            })
    }
}
