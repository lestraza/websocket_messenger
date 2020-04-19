import * as React from 'react'
import FormInput from '../../../Commons/FormInput'
import { action } from 'mobx'
import { IGetStore } from '../../../store/MainStore'
import { inject, observer } from 'mobx-react'

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
        const { savePropsNewContact } = this.dialogStore
        const value = e.currentTarget.value
        savePropsNewContact(value)
    }
    @action.bound
    public formSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { findContactByEmail } = this.dialogStore
        findContactByEmail()
    }

    @action.bound
    public onClickAddContact() {
        const { addContact } = this.dialogStore
        const { id } = this.authStore.client
        addContact()
    }
    public render() {
        const { email, name, lastname, id } = this.dialogStore.newContact
        const { addContactServerError } = this.dialogStore
        // const contactname = () => {
        //     if(name) {
        //         name.charAt(0).toUpperCase() + name.slice(1)
        //     }
        // }
        // const contactLastname = () => {
        //     if(lastname) {
        //         lastname.charAt(0).toUpperCase() + lastname.slice(1)
        //     }
        // }

        return (
            <div className="add-contact__container">
                <form className="add-contact__form" onSubmit={this.formSubmit}>
                    <FormInput
                        type={'email'}
                        placeholder={`Add new contact's email`}
                        id={'email'}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'add-contact__email-input'}
                        value={email}
                    />
                </form>
                {id && (
                    <div>
                        <div>{`Add to contacts ${name} ${lastname}?`}</div>
                        <div onClick={this.onClickAddContact}>Yes</div>
                        <div>No</div>
                    </div>
                )}
                {addContactServerError && <div>{addContactServerError}</div>}
            </div>
        )
    }
}
