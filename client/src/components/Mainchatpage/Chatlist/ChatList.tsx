import * as React from 'react'
import { action } from 'mobx'
import { IGetStore } from '../../../store/MainStore'
import ChatPreview from './ChatPreview'
import { inject, observer } from 'mobx-react'
import Logout from '../Logout/Logout'
import SettingsBar from '../SettingsBar/SettinsBar'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface IChatListProps {}

@inject('getStore')
@observer
export default class ChatList extends React.Component<IChatListProps> {
    mainStore = this.injected.getStore('mainStore')
    settingsStore = this.injected.getStore('settingsStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IChatListProps & IGetStore
    }

    @action.bound
    public renderChatPreviews() {
        const { users } = this.mainStore
        return users.map((user, i) => <ChatPreview user={user} />)
    }

    @action.bound
    onClickShowSettingsBar() {
        const { showOrCloseSettingsBar } = this.authStore
        showOrCloseSettingsBar()
    }

    public render() {
        const { isShowSettingsBar } = this.authStore
        return (
            <div className="chat-list">
                {isShowSettingsBar ? (
                    <SettingsBar />
                ) : (
                    <>
                        <div className="chat-list__header">
                            <div
                                className="chat-list__header-settings-button"
                                onClick={this.onClickShowSettingsBar}
                            >
                                <FontAwesomeIcon
                                    icon={faBars}
                                    color={'#bababa'}
                                    size={'lg'}
                                />
                            </div>
                            <Logout />
                        </div>
                        {this.renderChatPreviews()}
                    </>
                )}
            </div>
        )
    }
}
