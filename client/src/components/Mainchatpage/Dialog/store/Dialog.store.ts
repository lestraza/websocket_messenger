import { IContactResponse, findDialogById } from './../../../../requests/index'
import { IMessage } from './Dialog.interface'
import { IUser } from './../../../Auth/store/Auth.interface'
import { AbstractStore } from './../../../../store/Abstract.store'
import { AuthStore } from './../../../Auth/store/Auth.store'
import { action, observable, runInAction, computed } from 'mobx'
import {
    addContactReq,
    findContactReq,
    getContactById,
} from '../../../../requests'

const initContact = {
    email: '',
    id: '',
    name: '',
    lastname: '',
}

export class DialogStore extends AbstractStore {
    @observable
    public newContact: IUser = { ...initContact }

    @observable
    public isContactReceived: boolean = false

    @observable
    public contacts: IContactResponse[] = []

    @observable
    isShowAddContactModal: boolean = false

    @observable
    addContactServerError: string = ''

    @observable
    public currentDialog: IMessage[] = []

    @observable
    public currentDialogId: string = ''

    @observable
    public currentContact: IUser = {}

    @observable
    public newMessage: string = ''

    @observable
    public isAlreadyInContacts: boolean = false

    @computed
    private get authStore() {
        return this.mainStore.getStore('authStore') as AuthStore
    }

    @action.bound
    public showOrCloseAddContactModal() {
        if (this.isShowAddContactModal) {
            this.isShowAddContactModal = false
            this.newContact = { ...initContact }
            this.addContactServerError = ''
        } else {
            this.isShowAddContactModal = true
        }
    }

    @action.bound
    public searchNewContactEmail(email: string) {
        this.isAlreadyInContacts = this.contacts.some(
            (contact) => contact.email === email.trim()
        )
        this.newContact.email = email.trim()
        if (this.isAlreadyInContacts) {
            this.addContactServerError = 'Contact already added'
        } else {
            this.addContactServerError = ''
        }
    }

    @action.bound
    public addContact() {
        const data = {
            clientId: this.authStore.client.id || '',
            contactId: this.newContact.id || '',
        }
        addContactReq(data)
            .then((contact) => {
                runInAction(() => {
                    this.contacts = [...this.contacts, contact]
                    this.isShowAddContactModal = false
                    this.newContact = initContact
                    this.isContactReceived = false
                })
            })
            .catch((err) => {
                this.isContactReceived = false
                this.addContactServerError = err.error
            })
    }

    @action.bound
    public findContactByEmail() {
        if (this.isAlreadyInContacts) {
            return
        } else {
            findContactReq(this.newContact.email || '')
                .then((res) => {
                    runInAction(() => {
                        this.newContact.id = res.id
                        this.newContact.name = res.name
                        this.newContact.lastname = res.lastname
                        this.isShowAddContactModal = true

                        this.isContactReceived = true
                    })
                })
                .catch((err) => {
                    this.addContactServerError = err.message
                })
        }
    }

    @action.bound
    public getContactsById() {
        const { contacts } = this.authStore.client

        if (contacts) {
            return Promise.all(
                contacts.map((contact) => {
                    return getContactById(contact.contactId)
                })
            ).then((contacts) => {
                runInAction(() => {
                    this.contacts = contacts
                    this.newContact = { ...initContact }
                })
            })
        }
    }

    @action.bound
    public sendMessage() {
        const { id, name, lastname } = this.authStore.client
        const authStore = this.mainStore.getStore('authStore') as AuthStore

        const { socket } = authStore

        if (id && name && lastname && this.currentContact.id) {
            const dialogMessage: IMessage = {
                contactId: this.currentContact.id,
                id,
                name,
                lastname,
                text: this.newMessage,
                timeStamp: new Date().toISOString(),
                dialogId: this.currentDialogId,
            }
            if (dialogMessage && socket) {
                this.currentDialog = [...this.currentDialog, dialogMessage]
                socket.emit('sendMessage', dialogMessage)
            }
            this.newMessage = ''
        }
    }

    @action.bound
    public saveNewMessage(message: string) {
        this.newMessage = message
    }

    @action.bound
    public getContactHistory(contactId: string) {
        const { socket } = this.authStore
        const selectedContact = this.authStore.client.contacts?.find(
            (contact) => contact.contactId === contactId
        )
        if (this.currentDialogId) {
            socket?.emit('leaveChat', this.currentDialogId)
            this.currentDialog = []
        }
        if (selectedContact) {
            const { dialogId } = selectedContact
            this.currentDialogId = dialogId
            findDialogById(dialogId).then((dialog) => {
                runInAction(() => {
                    socket?.emit('joinChat', dialogId)
                    this.currentDialog = dialog.messages
                    this.contacts.forEach((contact) => {
                        if (contact.id === contactId) {
                            contact.hasNewMessage = false
                        }
                    })
                })
            })
        }
    }

    @action.bound
    sendNotification(id: string) {
        this.contacts.forEach((contact) => {
            if (contact.id === id) {
                contact.hasNewMessage = true
            }
        })
    }
}
