import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import { IGetStore } from '../../store/MainStore'
import { action, observable } from 'mobx'
import { IRegisterProps } from './store/Auth.store'

export interface ISignInProps {}
@inject('getStore')
@observer
export default class SignIn extends React.Component<ISignInProps> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ISignInProps & IGetStore
    }

    @observable
    requiredDataWarning: boolean = false

    @action.bound
    onChangeSaveValue(e: React.FormEvent<HTMLInputElement>) {
        const { saveInputValueRegisterForm } = this.authStore
        const value = e.currentTarget.value
        const prop = e.currentTarget.dataset.id
        if (prop) {
            saveInputValueRegisterForm(prop as keyof IRegisterProps, value)
        }
    }

    @action.bound
    onSubmitLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { clientLogin } = this.authStore
        const { email, password } = this.authStore.clientRegisterProps
        if (email && password) {
            this.requiredDataWarning = false
            clientLogin()
        } else {
            this.requiredDataWarning = true
        }
    }
    public render() {
        const { email, password } = this.authStore.clientRegisterProps
        return (
            <div className="auth-container">
                <p>Welcome to Messenger</p>
                <form className="auth-form" onSubmit={this.onSubmitLogin}>
                    <div>Email address</div>
                    <input
                        type="email"
                        data-id="email"
                        value={email}
                        onChange={this.onChangeSaveValue}
                    />
                    <div>Password</div>
                    <input
                        type="password"
                        data-id="password"
                        value={password}
                        onChange={this.onChangeSaveValue}
                    />
                    <input type="submit" value="Sign In" />
                </form>

                {this.requiredDataWarning && (
                    <div className="create-account__warning">
                        Please add all reqiured data
                    </div>
                )}

                <div className="create-account">
                    New to messenger?
                    <Link to={'/register'}>Create an account</Link>
                </div>
            </div>
        )
    }
}
