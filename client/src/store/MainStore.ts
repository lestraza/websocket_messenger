import { observable, action } from 'mobx'
import link from '../images/silvio.jpg'

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

class MainStore {
    @observable
    public clientEmail: string = ''

    @observable
    public clientPassword: string = ''

    @observable
    public clientName: string = ''

    @observable
    public clientLastName: string = ''

    @observable
    public users: IUser[] = []

    @observable
    public currentDialog: IMessage[] = []

    @observable
    public clientId: string = '123'

    @observable
    public newMessage: string = ''

    @observable
    public modal: string = ''

    @observable
    public isAuthenticated: boolean = false

    constructor() {
        this.getUsers()
    }

    @action.bound
    public getUsers() {
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
    public saveInputValue() {}

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
