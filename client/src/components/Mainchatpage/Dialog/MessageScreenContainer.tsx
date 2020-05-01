import * as React from 'react'
import { IGetStore } from '../../../store/MainStore'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'
import Message from './Message'

export interface IMessageScreenContainerProps {}

@inject('getStore')
@observer
export default class MessageScreenContainer extends React.Component<
    IMessageScreenContainerProps
> {
    dialogStore = this.injected.getStore('dialogStore')

    private get injected() {
        return this.props as IMessageScreenContainerProps & IGetStore
    }

    @action.bound
    renderScreenContainers() {
        return this.dialogStore.currentDialog.map((message) => {
            return <Message message={message} key={message.timeStamp}/>
        })
    }
    public render() {
        const { currentDialog } = this.dialogStore
        return <>{currentDialog.length > 0 && this.renderScreenContainers()}</>
    }
}
