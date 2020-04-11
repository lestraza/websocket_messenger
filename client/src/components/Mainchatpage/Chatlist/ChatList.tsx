import * as React from 'react'
import { action } from 'mobx'
import MainStore from '../../../store/MainStore'
import ChatPreview from './ChatPreview'
import { inject, observer } from 'mobx-react'
import Logout from '../Logout/Logout'

export interface IChatListProps {}

@inject('store')
@observer
export default class ChatList extends React.Component<IChatListProps> {
    mainStore = this.injected.store

    private get injected() {
        return this.props as { store: MainStore }
    }

    @action.bound
    public renderChatPreviews() {
        const { users } = this.mainStore
        return users.map((user, i) => <ChatPreview user={user} />)
    }

    public render() {
        return (
            <div className="chat-list">
                <div className="chat-list__header">
                    <Logout />
                </div>
                {this.renderChatPreviews()}
            </div>
        )
    }
}
