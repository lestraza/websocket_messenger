import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action } from 'mobx'
import MainStore from '../../../store/MainStore'

export interface ILogoutProps {}

@inject('store')
@observer
export default class Logout extends React.Component<ILogoutProps> {
    mainStore = this.injected.store

    private get injected() {
        return this.props as ILogoutProps & { store: MainStore }
    }
    @action.bound
    onClickLogout() {
        const { logout } = this.mainStore
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
