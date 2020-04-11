import * as React from 'react'
import { IUser } from '../../../store/MainStore'

export interface IChatPreviewProps {
    user: IUser
}

export default class ChatPreview extends React.Component<IChatPreviewProps> {
    private get backgroundImage() {
        return {
            backgroundImage: `url(${this.props.user.avatarUrl})`,
        }
    }

    public render() {
        return (
            <div className="chat-preview">
                <div
                    className="chat-preview__user-pic"
                    style={this.backgroundImage}
                ></div>
                <div className="chat-preview__user">
                    {`${this.props.user.name} ${this.props.user.lastName}`}
                </div>
            </div>
        )
    }
}
