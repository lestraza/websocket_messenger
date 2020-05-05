import { AbstractStore } from './../../../../store/Abstract.store'
import { observable, computed } from 'mobx'



export interface IChangeSettingsProps {
    name?: string
    lastname?: string
    email?: string
    password?: string
    _id?: string
}

export class SettingsStore extends AbstractStore {
    
    @observable
    public isShowSettingsBar: boolean = false

    @computed
    private get authStore() {
        return this.mainStore.getStore('authStore')
    }

}