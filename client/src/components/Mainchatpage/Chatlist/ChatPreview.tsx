import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/Abstract.store'
import { IContactResponse } from '../../../requests'
import { action } from 'mobx'

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

    private get backgroundImage() {
        return {
            backgroundImage: `url(${this.props.contact.avatarUrl})`,
        }
    }
    @action.bound
    public onClickGetHistory() {
        const { getContactHistory } = this.dialogStore
        this.dialogStore.currentContact = { ...this.props.contact }
        getContactHistory(this.props.contact.id)
    }

    public render() {
        const { name, lastname, id } = this.props.contact
        return (
            <div
                className={`chat-preview ${
                    this.dialogStore.currentContact.id === id
                        ? 'selected-contact'
                        : ''
                }`}
                onClick={this.onClickGetHistory}
            >
                <div
                    className="chat-preview__user-pic"
                    style={this.backgroundImage}
                ></div>
                <div className="chat-preview__user">
                    {`${name} ${lastname}`}
                </div>
            </div>
        )
    }
}
