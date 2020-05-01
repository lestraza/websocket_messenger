import * as React from 'react'
import FormInput from '../../Commons/FormInput'
import { action, observable } from 'mobx'
import { IGetStore } from '../../../store/MainStore'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Confirm from '../../Commons/Confirm'
import ServerError from '../../Commons/ServerError'

export interface IAddContactProps {}
@inject('getStore')
@observer
export default class AddContact extends React.Component<IAddContactProps> {
    dialogStore = this.injected.getStore('dialogStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IAddContactProps & IGetStore
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
    }

    @action.bound
    public onClickAddContact() {
        let { isContactReceived } = this.dialogStore
        isContactReceived = false
        const { addContact } = this.dialogStore
        addContact()
    }

    @action.bound
    public onClickCloseModal() {
        const { showOrCloseAddContactModal } = this.dialogStore
        showOrCloseAddContactModal()
    }
    public render() {
        const { email, name, lastname } = this.dialogStore.newContact
        const { serverError, isContactReceived } = this.dialogStore

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
                    {isContactReceived && (
                        <Confirm
                            title={`Add to contacts ${name} ${lastname}?`}
                            onConfirm={this.onClickAddContact}
                            onReject={this.onClickCloseModal}
                        />
                    )}
                    {serverError && (
                        <div className="message message--error">
                            <ServerError error={serverError}/>
                        </div>
                    )}
                </div>
            </>
        )
    }
}
