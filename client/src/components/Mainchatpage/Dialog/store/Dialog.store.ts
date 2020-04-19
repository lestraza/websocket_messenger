import { IContactProps } from './Dialog.interface'
import { IUser } from './../../../Auth/store/Auth.interface'
import { AbstractStore } from './../../../../store/Abstract.store'
import { AuthStore } from './../../../Auth/store/Auth.store'
import { action, observable, runInAction, computed } from 'mobx'
import { addContactReq, findContactReq } from '../../../../requests'

export class DialogStore extends AbstractStore {
    @observable
    newContact: IUser = {
        email: '',
        id: '',
        name: '',
        lastname: '',
    }

    @observable
    isShowAddContactModal: boolean = false

    @observable
    addContactServerError: string = ''

    @observable
    contacts: IContactProps[] = []

    @computed
    private get authStore() {
        return this.mainStore.getStore('authStore') as AuthStore
    }

    @action.bound
    public addContact() {
        const data = {
            clientId: this.authStore.client.id || '',
            contactId: this.newContact.id || '',
        }
        addContactReq(data).then((res) => {
            runInAction(() => {
                this.contacts = res.contacts
                this.isShowAddContactModal = false
                console.log(this.contacts)
            })
        })
    }

    @action.bound
    public findContactByEmail() {
        findContactReq(this.newContact.email || '')
            .then((res) => {
                runInAction(() => {
                    this.newContact.id = res.id
                    this.newContact.name = res.name
                    this.newContact.lastname = res.lastname
                    this.isShowAddContactModal = true
                })
            })
            .catch((err) => {
                this.addContactServerError = err.message
            })
    }

    @action.bound
    public showOrCloseAddContactModal() {
        if (this.isShowAddContactModal) {
            this.isShowAddContactModal = false
        } else {
            this.isShowAddContactModal = true
        }
    }
    @action.bound
    public savePropsNewContact(email: string) {
        this.newContact.email = email.trim()
    }
}
