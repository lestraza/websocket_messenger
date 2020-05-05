import * as React from 'react'
import ChatList from './Chatlist/ChatList'
import Dialog from './Dialog/Dialog'

export interface IMainChatPageProps {}

export default class MainChatPage extends React.Component<IMainChatPageProps> {
    public render() {
        return (
            <>
                <ChatList />
                <Dialog />
            </>
        )
    }
}
