import { SettingsStore } from './../components/Mainchatpage/SettingsBar/store/Settings.store'
import { DialogStore } from './../components/Mainchatpage/Dialog/store/Dialog.store'
import { AbstractStore } from './Abstract.store'
import { AuthStore } from './../components/Auth/store/Auth.store'
import { observable, action, computed } from 'mobx'
import { getEnv, getServerUrl } from '../env'
export interface IInnerStores {
    dialogStore: DialogStore
    mainStore: MainStore
    authStore: AuthStore
    settingsStore: SettingsStore
}

export interface IGetStore {
    getStore<T extends keyof IInnerStores>(storeName: T): IInnerStores[T]
}

class MainStore extends AbstractStore {
    @observable
    public clientId: string = ''

    @observable
    public error: string = ''

    @observable
    public success: string = ''

    @computed
    public get env() {
        return getEnv()
    }

    @computed
    public get serverUrl() {
        return getServerUrl()
    }

    @observable
    private innerStores: IInnerStores = {
        dialogStore: new DialogStore(),
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
}
export default MainStore
