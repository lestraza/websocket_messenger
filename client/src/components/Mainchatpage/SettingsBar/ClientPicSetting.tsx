import * as React from 'react'
import { IGetStore } from '../../../store/MainStore'
import { inject, observer } from 'mobx-react'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { action } from 'mobx'

export interface IClientPicSettingProps {}

@inject('getStore')
@observer
export default class ClientPicSetting extends React.Component<
    IClientPicSettingProps
> {
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IClientPicSettingProps & IGetStore
    }

    private get backgroundImage() {
        const { client } = this.authStore
        return {
            backgroundImage: `url(${client.avatarUrl})`,
        }
    }

    @action.bound
    OnChangeUploadPic(event: React.SyntheticEvent<HTMLInputElement>) {
        event.preventDefault()
        const target = event.currentTarget
        const { changeProfilePhoto } = this.authStore
        const { id = '' } = this.authStore.client
        changeProfilePhoto(target, id)
    }
    public render() {
        return (
            <div className="client-settings__client-pic-container">
                <div
                    className="client-settings__client-pic"
                    style={this.backgroundImage}
                >
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
                </div>
            </div>
        )
    }
}
