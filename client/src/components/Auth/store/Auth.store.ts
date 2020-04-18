import { IRegisterProps, IClient, IChangeSettingsProps } from './Auth.interface'
import { AbstractStore } from './../../../store/Abstract.store'
import {
    ISaveProfilePhotoResponse,
    saveProfilePhotoReq,
} from './../../../requests/index'
import { action, observable, runInAction, computed } from 'mobx'
import {
    registerClient,
    loginClientReq,
    authClientReq,
    updateClientSettings,
} from '../../../requests'

export class AuthStore extends AbstractStore {
    @observable
    public clientRegisterProps: IRegisterProps = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        avatarUrl: '',
    }

    @observable
    public client: IClient = {
        id: '',
        name: '',
        lastName: '',
        email: '',
        avatarUrl: '',
        isOnline: false,
    }

    @observable
    public isAuthenticated: boolean = false

    @observable
    public isRegistered: boolean = false

    @observable
    public clientId: string = ''

    @observable
    public errorExistedEmail: string = ''

    @observable
    public errorAuthentication: string = ''

    @observable
    public isAuthenticatedByToken: boolean = false

    @observable
    newSettings: IChangeSettingsProps = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        _id: '',
    }

    @observable
    public isShowSettingsBar: boolean = false

    @computed
    private get settingsStore() {
        return this.mainStore.getStore('settingsStore')
    }

    constructor() {
        super()
        this.authClient()
    }

    @action.bound
    public saveInputValueRegisterForm(
        prop: keyof IRegisterProps,
        value: string
    ) {
        this.clientRegisterProps[prop] = value
    }

    @action.bound
    public registerNewClient() {
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
                            email: res.email,
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
    public showOrCloseSettingsBar() {
        if (this.isShowSettingsBar) {
            this.isShowSettingsBar = false
        } else {
            this.isShowSettingsBar = true
        }
    }

    @action.bound
    public changeProfilePhoto(target: any, id: string) {
        const blob = new Blob([target.files[0]], { type: 'application/json' })
        const fileReader = new FileReader()
        console.log(blob)
        fileReader.addEventListener('load', (target) => {
            console.log(fileReader.result)
        })
        const avatarUrl = fileReader.readAsArrayBuffer(blob)
        console.log(avatarUrl)
        const args: ISaveProfilePhotoResponse = {
            avatarUrl: avatarUrl,
            _id: id,
        }
        console.log(args)
        saveProfilePhotoReq(args)
    }

    @action.bound
    public saveInputValueNewSettingsForm(
        prop: keyof IChangeSettingsProps,
        value: string
    ) {
        this.newSettings[prop] = value
    }

    @action.bound
    public submutNewSettings() {
        this.newSettings._id = this.client.id
        updateClientSettings(this.newSettings)
            .then((res) => {
                runInAction(() => {
                    this.authClient()
                })
            })
            .catch((err) => {
                runInAction(() => {
                    console.error(err)
                })
            })
    }
}
