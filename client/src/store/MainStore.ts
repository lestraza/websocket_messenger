import { AbstractStore } from './Abstract.store'
import { AuthStore } from './../components/Auth/store/Auth.store'
import { SettingsStore } from './../components/Mainchatpage/SettingsBar/store/Settings.store'
import { observable, action, runInAction } from 'mobx'
import link from '../images/silvio.jpg'
import { registerClient, loginClientReq, authClientReq } from '../requests'
import { Z_ASCII } from 'zlib'

export interface IMessage {
    userId: string
    fullName: string
    text: string
    timeStamp: string
}

export interface IUser {
    id: string
    name: string
    lastName: string
    avatarUrl: string
    isOnline: boolean
}

export interface IInnerStores {
    settingsStore: SettingsStore
    mainStore: MainStore
    authStore: AuthStore
}

export interface IGetStore {
    getStore<T extends keyof IInnerStores>(storeName: T): IInnerStores[T]
}

class MainStore extends AbstractStore {
    @observable
    public users: IUser[] = []

    @observable
    public currentDialog: IMessage[] = []

    @observable
    public newMessage: string = ''

    @observable
    public clientId: string = ''

    @observable
    public innerStores: IInnerStores = {
        settingsStore: new SettingsStore(),
        mainStore: this,
        authStore: new AuthStore(),
    }

    constructor() {
        super()
        Object.keys(this.innerStores).forEach((storeName) => {
            const store = this.innerStores[storeName as keyof IInnerStores]
            store.setStore(this)
        })
    }

    @action.bound
    public getStore(storeName: keyof IInnerStores) {
        return this.innerStores[storeName]
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
