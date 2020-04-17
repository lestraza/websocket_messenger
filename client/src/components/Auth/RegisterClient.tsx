import * as React from 'react'
import { inject, observer } from 'mobx-react'
import MainStore, { IRegisterProps } from '../../store/MainStore'
import { action, observable } from 'mobx'
import { Link } from 'react-router-dom'

export interface IRegisterClientProps {}

@inject('store')
@observer
export default class RegisterClient extends React.Component<
    IRegisterClientProps
> {
    mainStore = this.injected.store

    private get injected() {
        return this.props as IRegisterClientProps & { store: MainStore }
    }

    @observable
    requiredDataWarning: boolean = false

    @observable
    successfullRegisterNotification: boolean = false

    @action.bound
    public onChangeSaveValue(e: React.FormEvent<HTMLInputElement>) {
        const { saveInputValue } = this.mainStore
        const value = e.currentTarget.value
        const prop = e.currentTarget.dataset.id
        if (prop) {
            saveInputValue(prop as keyof IRegisterProps, value)
        }
    }

    @action.bound
    onSubmitNewClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { registerNewClient } = this.mainStore
        const {
            name,
            lastname,
            email,
            password,
        } = this.mainStore.clientRegisterProps
        if (name && lastname && email && password) {
            this.requiredDataWarning = false
            registerNewClient()
            this.successfullRegisterNotification = true
        } else {
            this.requiredDataWarning = true
            console.log('error')
        }
    }

    public render() {
        const {
            name,
            lastname,
            email,
            password,
        } = this.mainStore.clientRegisterProps
        const { errorExistedEmail } = this.mainStore
        return (
            <div className="create-account">
                <div className="create-account__title">Create your account</div>
                <form
                    className="create-account__form"
                    onSubmit={this.onSubmitNewClient}
                >
                    <div className="create-account__subtitle">Name</div>
                    <input
                        type="text"
                        value={name}
                        data-id="name"
                        onChange={this.onChangeSaveValue}
                    />
                    <div className="create-account__subtitle">Last name</div>
                    <input
                        type="text"
                        data-id="lastname"
                        value={lastname}
                        onChange={this.onChangeSaveValue}
                    />
                    <div className="create-account__subtitle">
                        Email address
                    </div>
                    <input
                        type="email"
                        data-id="email"
                        value={email}
                        onChange={this.onChangeSaveValue}
                    />
                    <div className="create-account__subtitle">Password</div>
                    <input
                        type="password"
                        data-id="password"
                        value={password}
                        onChange={this.onChangeSaveValue}
                    />
                    <input type="submit" value="Register" />
                </form>
                {this.requiredDataWarning && (
                    <div className="create-account__warning">
                        Please add all reqiured data
                    </div>
                )}
                {errorExistedEmail && <div>{errorExistedEmail}</div>}
                {this.successfullRegisterNotification && (
                    <div>
                        You have successfully registered! <br />
                        To continue working in the application please
                        <Link to={'/signin'}> sign in</Link>
                    </div>
                )}
                <p>
                    By creating an account, you agree to the Terms of Service.
                    For more information about Messenger's privacy practices,
                    see the Messenger Privacy Statement. We'll occasionally send
                    you account-related emails.
                </p>
            </div>
        )
    }
}
