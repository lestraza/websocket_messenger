import { AuthStore } from './../../../Auth/store/Auth.store'
import { action, observable, runInAction } from 'mobx'
import { addContactReq, findContactReq } from '../../../../requests'
import MainStore from '../../../../store/MainStore'

export interface INewContactsProps {
    email: string
    contactId: string
    name: string
    lastname: string
}

export interface IContact {
    id: string
    name: string
    lastName: string
    avatarUrl: string
    isOnline: boolean
}

export interface IContactProps {
    contactId: string
    dialogId: string
}

export class DialogStore {
    @observable
    newContact: INewContactsProps = {
        email: '',
        contactId: '',
        name: '',
        lastname: '',
    }

    @observable
    clientId: string = ''

    @observable
    isShowAddContactModal: boolean = false

    @observable
    contacts: IContactProps[] = []

    @action.bound
    public addContact(id: string) {
        const data = {
            clientId: id,
            contactId: this.newContact.contactId,
        }
        addContactReq(data).then((res) => {
            runInAction(() => {
                this.contacts = res.contacts
                this.isShowAddContactModal = false
            })
        })
    }

    @action.bound
    public findContactByEmail() {
        findContactReq(this.newContact.email).then((res) => {
            runInAction(() => {
                this.newContact.contactId = res.id
                this.newContact.name = res.name
                this.newContact.lastname = res.lastname
            })
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
