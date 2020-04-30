import * as React from 'react'
import { IGetStore } from '../../../store/MainStore'
import { action, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DeleteAccountModal from './DeleteAccountModal'

export interface ISettingsBarHeaderProps {}

@inject('getStore')
@observer
export default class SettingsBarHeader extends React.Component<
    ISettingsBarHeaderProps
> {
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ISettingsBarHeaderProps & IGetStore
    }

    @action.bound
    onClickCloseSettingsBar() {
        const { showOrCloseSettingsBar } = this.authStore
        showOrCloseSettingsBar()
    }

    @observable
    isShowDeleteAccountModal: boolean = false

    @action.bound
    onClickDeleteAccountModal() {
        this.isShowDeleteAccountModal = true
    }

    public render() {
        return (
            <>
                <div className="client-settings__header">
                    <div
                        className="client-settings__header-arrow"
                        onClick={this.onClickCloseSettingsBar}
                    >
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            color={'#fff'}
                            size={'1x'}
                        />
                    </div>
                    <div className="client-settings__header-title">Profile</div>
                    <div onClick={this.onClickDeleteAccountModal}>
                        Delete account
                    </div>
                    {this.isShowDeleteAccountModal && <DeleteAccountModal />}
                </div>
            </>
        )
    }
}
