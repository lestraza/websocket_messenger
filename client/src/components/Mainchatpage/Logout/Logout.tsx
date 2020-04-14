import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action } from 'mobx'
import MainStore, { IGetStore } from '../../../store/MainStore'

export interface ILogoutProps {}

@inject('getStore')
@observer
export default class Logout extends React.Component<ILogoutProps> {
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ILogoutProps & IGetStore
    }
    @action.bound
    onClickLogout() {
        const { logout } = this.authStore
        logout()
    }
    public render() {
        return (
            <div className="logout__container">
                <div onClick={this.onClickLogout}>Logout</div>
            </div>
        )
    }
}
