import { IInnerStores } from './MainStore'
import MainStore from './MainStore'
import { observable, action } from 'mobx'

export interface IGetStore {
    getStore<T extends keyof IInnerStores>(storeName: T): IInnerStores[T]
}

export class AbstractStore {
    @observable
    public mainStore!: MainStore

    @action
    public setStore(store: MainStore) {
        this.mainStore = observable(store)
    }
}
