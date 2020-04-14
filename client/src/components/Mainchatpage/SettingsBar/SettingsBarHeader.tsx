import * as React from 'react'
import MainStore, { IGetStore } from '../../../store/MainStore'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface ISettingsBarHeaderProps {}

@inject('getStore')
@observer
export default class SettingsBarHeader extends React.Component<
    ISettingsBarHeaderProps
> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ISettingsBarHeaderProps & IGetStore
    }

    @action.bound
    onClickCloseSettingsBar() {
        const { showOrCloseSettingsBar } = this.authStore
        showOrCloseSettingsBar()
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
                            color={'#363636'}
                            size={'1x'}
                        />
                    </div>
                    <div className="client-settings__header-title">Profile</div>
                </div>
            </>
        )
    }
}
