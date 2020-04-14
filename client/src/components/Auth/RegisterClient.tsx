import * as React from 'react'
import { inject, observer } from 'mobx-react'
import MainStore, { IGetStore } from '../../store/MainStore'
import { action, observable } from 'mobx'
import { Link } from 'react-router-dom'
import { IRegisterProps } from './store/Auth.store'

export interface IRegisterClientProps {}

@inject('getStore')
@observer
export default class RegisterClient extends React.Component<
    IRegisterClientProps
> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IRegisterClientProps & IGetStore
    }

    @observable
    requiredDataWarning: boolean = false

    @observable
    successfullRegisterNotification: boolean = false

    @action.bound
    public onChangeSaveValue(e: React.ChangeEvent<HTMLInputElement>) {
        const { saveInputValueRegisterForm } = this.authStore
        const value = e.currentTarget.value
        const prop = e.currentTarget.dataset.id
        if (prop) {
            saveInputValueRegisterForm(prop as keyof IRegisterProps, value)
        }
    }

    @action.bound
    onSubmitNewClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { registerNewClient } = this.authStore
        const {
            name,
            lastname,
            email,
            password,
        } = this.authStore.clientRegisterProps
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
        } = this.authStore.clientRegisterProps
        const { errorExistedEmail } = this.authStore
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
                {this.successfullRegisterNotification && !errorExistedEmail ? (
                    <div>
                        You have successfully registered! <br />
                        To continue working in the application please
                        <Link to={'/signin'}> sign in</Link>
                    </div>
                ) : null}
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
