import * as React from 'react'
import FormInput from '../../Commons/FormInput'
import { action, observable, runInAction } from 'mobx'
import { IGetStore } from '../../../store/MainStore'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Confirm from '../../Commons/Confirm'
import Error from '../../Commons/Error'

export interface IAddContactProps {}
@inject('getStore')
@observer
export default class AddContact extends React.Component<IAddContactProps> {
    dialogStore = this.injected.getStore('dialogStore')
    authStore = this.injected.getStore('authStore')
    mainStore = this.injected.getStore('mainStore')

    private get injected() {
        return this.props as IAddContactProps & IGetStore
    }

    componentWillUnmount() {
        this.mainStore.error = ''
    }

    @action.bound
    public onChangeSaveValue(e: React.ChangeEvent<HTMLInputElement>) {
        const { searchNewContactEmail } = this.dialogStore
        const value = e.currentTarget.value
        searchNewContactEmail(value)
    }
    @action.bound
    public formSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { findContactByEmail } = this.dialogStore
        findContactByEmail()
        .then(() => {
            runInAction(() => {
                this.isConfirmShown = true
            })
        })
        .catch((err) => {
            runInAction(() => {
                this.mainStore.error = err.error
            })    
        })
    }

    @action.bound
    public onClickAddContact() {
        const { addContact } = this.dialogStore
        addContact()
    }
    @observable
    public isConfirmShown: boolean = false

    @action.bound
    public onClickCloseModal() {
        this.isConfirmShown = false
    }
    public render() {
        const { email, name, lastname } = this.dialogStore.newContact
        const { error } = this.mainStore

        return (
            <>
                <div className="blur" onClick={this.onClickCloseModal}></div>
                <div className="add-contact__container">
                    <div className="add-contact__header">
                        <h1>Add a contact</h1>
                        <div
                            className="add-contact__close-modal"
                            onClick={this.onClickCloseModal}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>

                    <form
                        className="add-contact__form"
                        onSubmit={this.formSubmit}
                    >
                        <FormInput
                            type={'email'}
                            placeholder={`Search for contact's email`}
                            id={'email'}
                            required={false}
                            onChange={this.onChangeSaveValue}
                            className={'add-contact__email-input'}
                            value={email}
                        />
                    </form>
                    {this.isConfirmShown && (
                        <Confirm
                            title={`Add to contacts ${name} ${lastname}?`}
                            onConfirm={this.onClickAddContact}
                            onReject={this.onClickCloseModal}
                        />
                    )}
                    <Error error={error}/>
                </div>
            </>
        )
    }
}
