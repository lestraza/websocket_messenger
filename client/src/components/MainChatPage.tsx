import * as React from 'react'
import ChatList from './ChatList'
import Dialog from './Dialog'

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
