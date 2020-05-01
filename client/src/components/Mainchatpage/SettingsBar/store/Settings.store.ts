import { AbstractStore } from './../../../../store/Abstract.store'
import { AuthStore } from './../../../Auth/store/Auth.store'
import {
    ISaveProfilePhotoResponse,
    updateClientSettings,
} from './../../../../requests/index'
import { observable, action, runInAction, computed } from 'mobx'
import { saveProfilePhotoReq } from '../../../../requests'
import MainStore from '../../../../store/MainStore'

export interface IChangeSettingsProps {
    name?: string
    lastname?: string
    email?: string
    password?: string
    _id?: string
}

export class SettingsStore extends AbstractStore {
    constructor() {
        super()
    }
    @observable
    public isShowSettingsBar: boolean = false

    @computed
    private get authStore() {
        return this.mainStore.getStore('authStore')
    }

    @observable
    newSettings: IChangeSettingsProps = {
        name: '',
        lastname: '',
        email: '',
        password: '',
        _id: '',
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
    public saveInputValue(prop: keyof IChangeSettingsProps, value: string) {
        this.newSettings[prop] = value
    }

    @action.bound
    public submutNewSettings(id: string) {
        this.newSettings._id = id
        updateClientSettings(this.newSettings)
            .then((res) => {
                console.log(res)
                runInAction(() => {})
            })
            .catch((err) => {
                runInAction(() => {
                    console.error(err)
                })
            })
    }

    @action.bound
    public updateClientPropsInAuthStore() {}
}
