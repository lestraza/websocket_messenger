import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { computed } from 'mobx'
import { IGetStore } from '../../store/Abstract.store'
import defaultUserPic from '../../assets/default-user.png'
import { IUser } from '../Auth/store/Auth.interface'

export interface IAvatarImgProps {
    className: string
    user: IUser
}

@inject('getStore')
@observer
export default class AvatarImg extends React.Component<IAvatarImgProps> {
    authStore = this.injected.getStore('authStore')
    mainStore = this.injected.getStore('mainStore')

    private get injected() {
        return this.props as IAvatarImgProps & IGetStore
    }

    @computed
    private get backgroundImage() {
        const { avatarUrl } = this.props.user
        return {
            backgroundImage: `url(${
                avatarUrl
                    ? `${this.mainStore.serverUrl}/${avatarUrl}`
                    : defaultUserPic
            })`,
        }
    }
    public render() {
        const { className } = this.props
        return (
            <div className={className} style={this.backgroundImage}>
                {this.props.children}
            </div>
        )
    }
}
