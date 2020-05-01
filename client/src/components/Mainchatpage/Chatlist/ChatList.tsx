import * as React from 'react'
import { IGetStore } from '../../../store/MainStore'
import { inject, observer } from 'mobx-react'
import SettingsBar from '../SettingsBar/SettinsBar'
import ChatListHeader from './ChatListHeader'
import { action } from 'mobx'
import ChatPreview from './ChatPreview'
import { IContactResponse } from '../../../requests'

export interface IChatListProps {}

@inject('getStore')
@observer
export default class ChatList extends React.Component<IChatListProps> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')
    dialogStore = this.injected.getStore('dialogStore')

    private get injected() {
        return this.props as IChatListProps & IGetStore
    }

    @action.bound
    public renderChatListPreview(contacts: IContactResponse[]) {        
        return contacts.map((contact) => {
            return <ChatPreview contact={contact} key={contact.name + contact.lastname}/>
        })
    }

    public render() {
        const { isShowSettingsBar } = this.authStore
        const { contacts } = this.dialogStore

        return (
            <div className="chat-list">
                {isShowSettingsBar ? (
                    <SettingsBar />
                ) : (
                    <>
                        <ChatListHeader />
                        {this.renderChatListPreview(contacts)}
                    </>
                )}
            </div>
        )
    }
}
