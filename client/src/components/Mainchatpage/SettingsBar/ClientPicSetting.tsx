import * as React from 'react'
import { IGetStore } from '../../../store/MainStore'
import { inject, observer } from 'mobx-react'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { action, computed } from 'mobx'
import AvatarImg from '../../../Commons/AvatarImg'

export interface IClientPicSettingProps {}

@inject('getStore')
@observer
export default class ClientPicSetting extends React.Component<
    IClientPicSettingProps
> {
    authStore = this.injected.getStore('authStore')
    mainStore = this.injected.getStore('mainStore')

    private get injected() {
        return this.props as IClientPicSettingProps & IGetStore
    }

    @action.bound
    OnChangeUploadPic(event: React.SyntheticEvent<HTMLInputElement>) {
        event.preventDefault()
        const target = event.currentTarget
        const { changeProfilePhoto } = this.authStore
        changeProfilePhoto(target)
    }
    public render() {
        return (
            <div className="client-settings__client-pic-container">
                <AvatarImg className="client-settings__client-pic">
                <div className="client-settings__client-pic-shadow-container">
                        <input
                            type="file"
                            id="upload-input"
                            className="client-settings__upload-input"
                            name="client-settings__upload-input"
                            onChange={this.OnChangeUploadPic}
                        />
                        <label
                            htmlFor="upload-input"
                            className="client-settings__upload-label"
                        >
                            <FontAwesomeIcon
                                icon={faCamera}
                                color={'#bababa'}
                                size={'2x'}
                                className="client-settings__upload-icon"
                            />
                            Change profile photo
                        </label>
                    </div>
                </AvatarImg>
            </div>
        )
    }
}
