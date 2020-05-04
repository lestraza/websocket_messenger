import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { action, observable } from 'mobx'
import { IGetStore } from '../../../store/MainStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Confirm from '../../Commons/Confirm'

export interface ILogoutProps {}

@inject('getStore')
@observer
export default class Logout extends React.Component<ILogoutProps> {
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ILogoutProps & IGetStore
    }
    @observable
    private hasShowComfirm: boolean = false

    @action.bound
    onClickShowConfirm() {
        if (!this.hasShowComfirm) {
            this.hasShowComfirm = true
        } else {
            this.hasShowComfirm = false
        }
    }

    @action.bound
    private onClickLogout() {
        console.log('logout');
        const { logout } = this.authStore
        logout()
    }
    public render() {
        return (
            <>
                <div className="logout-container">
                    <div onClick={this.onClickShowConfirm}>
                        <FontAwesomeIcon icon={faSignOutAlt} size={'lg'} />
                    </div>
                </div>
                {this.hasShowComfirm && (
                    <div className="logout__confirm">
                        <Confirm
                            title={`Are you sure log out of the Messenger?`}
                            onConfirm={this.onClickLogout}
                            onReject={this.onClickShowConfirm}
                        />
                    </div>
                )}
            </>
        )
    }
}
