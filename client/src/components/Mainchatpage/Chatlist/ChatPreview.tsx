import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/Abstract.store'
import { IContactResponse } from '../../../requests'
import { action } from 'mobx'
import defaultUserPic from '../../../assets/default-user.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import AvatarImg from '../../../Commons/AvatarImg'

export interface IChatPreviewProps {
    contact: IContactResponse
}
@inject('getStore')
@observer
export default class ChatPreview extends React.Component<IChatPreviewProps> {
    mainStore = this.injected.getStore('mainStore')
    dialogStore = this.injected.getStore('dialogStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IChatPreviewProps & IGetStore
    }

    @action.bound
    public onClickGetHistory() {
        const { getContactHistory } = this.dialogStore
        this.dialogStore.currentContact = { ...this.props.contact }
        getContactHistory(this.props.contact.id)
    }

    public render() {
        const { name, lastname, id, hasNewMessage } = this.props.contact
        const hasNotification = this.dialogStore.currentContact.id === id
        const { id: selectedContactId } = this.dialogStore.currentContact

        return (
            <div
                className={`chat-preview ${
                    hasNewMessage ? 'send-notification' : ''
                } ${id === selectedContactId ? 'selected-contact' : ''}`}
                onClick={this.onClickGetHistory}
            >
                <AvatarImg
                    className="chat-preview__user-pic"
                    user={this.props.contact}
                />
                <div className="chat-preview__user">
                    {`${name} ${lastname}`}
                </div>
                {hasNotification && (
                    <div className="chat-preview__notification">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                )}
            </div>
        )
    }
}
