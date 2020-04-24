import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action } from 'mobx'
import MainStore, { IGetStore } from '../../../store/MainStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

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
            <div className="logout-container">
                <div onClick={this.onClickLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} size={'lg'} />
                </div>
            </div>
        )
    }
}
