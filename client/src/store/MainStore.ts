import { observable, action, runInAction } from 'mobx'

export interface IUser {
    id: string
    name: string
    lastName: string
    avatarUrl: string
    isOnline: boolean
}

export interface IMessage {
    userId: string
    text: string
    timeStamp: string
}


class MainStore {    
    @observable
    public users: IUser[] = []

    @observable
    public currentDialog: IMessage[] = []

    @observable
    public clientId: string = ''
    
    @action.bound
    public getUsers() {

    }
}
export default MainStore