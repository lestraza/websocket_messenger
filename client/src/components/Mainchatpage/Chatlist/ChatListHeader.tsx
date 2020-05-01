import * as React from 'react'
import { IGetStore } from '../../../store/MainStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons'
import { action, observable } from 'mobx'
import ChatPreview from './ChatPreview'
import Logout from '../Logout/Logout'
import { inject, observer } from 'mobx-react'

export interface IChatListHeaderProps {}
@inject('getStore')
@observer
export default class ChatListHeader extends React.Component<
    IChatListHeaderProps
> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')
    dialogStore = this.injected.getStore('dialogStore')

    private get injected() {
        return this.props as ChatListHeader & IGetStore
    }

    // @action.bound
    // public renderChatPreviews() {
    //     const { users } = this.mainStore
    //     return users.map((user, i) => <ChatPreview user={user} />)
    // }

    @action.bound
    public onClickShowSettingsBar() {
        const { showOrCloseSettingsBar } = this.authStore
        showOrCloseSettingsBar()
    }

    @action.bound
    public onClickShowAddContactModal() {
        const { showOrCloseAddContactModal } = this.dialogStore
        showOrCloseAddContactModal()
    }
    public render() {
        return (
            <>
                <div className="chat-list__header">
                    <div
                        className="chat-list__header-settings-button"
                        onClick={this.onClickShowSettingsBar}
                    >
                        <FontAwesomeIcon icon={faBars} size={'lg'} />
                    </div>

                    <div
                        className="chat-list__header-add-contact"
                        onClick={this.onClickShowAddContactModal}
                    >
                        <FontAwesomeIcon icon={faPlus} size={'lg'} />
                    </div>
                    <Logout />
                </div>
                {/* {this.renderChatPreviews()} */}
            </>
        )
    }
}
