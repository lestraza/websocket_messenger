import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import MainStore from '../../store/MainStore'
import RegisterClient from './RegisterClient'

export interface ISignInProps {}
@inject('store')
@observer
export default class SignIn extends React.Component<ISignInProps> {
    mainStore = this.injected.store
    private get injected() {
        return this.props as ISignInProps & { store: MainStore }
    }
    public render() {
        const { clientEmail, clientPassword } = this.mainStore
        return (
            <div className="auth-container">
                <p>Welcome to Messenger</p>
                <form className="auth-form">
                    <div>Username or email address</div>
                    <input type="email" value={clientEmail} />
                    <div>Password</div>
                    <input type="password" value={clientPassword} />
                    <input type="submit" value="Sign In" />
                </form>

                <div className="create-account">
                    New to messenger?
                    <Link to={'/register'}>Create an account</Link>
                </div>
            </div>
        )
    }
}
