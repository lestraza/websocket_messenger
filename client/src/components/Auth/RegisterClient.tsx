import * as React from 'react'
import { inject, observer } from 'mobx-react'
import MainStore from '../../store/MainStore'
import { action } from 'mobx'

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

    @action.bound
    public onChangeSaveValue() {}

    public render() {
        const {
            clientName,
            clientLastName,
            clientEmail,
            clientPassword,
        } = this.mainStore
        return (
            <div className="create-account">
                <div>Create your account</div>
                <form className="create-account__form">
                    <div className="create-account__subtitle"> Name </div>
                    <input
                        type="text"
                        value={clientName}
                        onChange={this.onChangeSaveValue}
                    />
                    <div className="create-account__subtitle">Last name </div>
                    <input
                        type="text"
                        value={clientLastName}
                        onChange={this.onChangeSaveValue}
                    />
                    <div className="create-account__subtitle">
                        Email address
                    </div>
                    <input
                        type="email"
                        value={clientEmail}
                        onChange={this.onChangeSaveValue}
                    />
                    <div className="create-account__subtitle">Password</div>
                    <input
                        type="password"
                        value={clientPassword}
                        onChange={this.onChangeSaveValue}
                    />
                    <input type="submit" value="Register" />
                </form>

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
