import * as React from 'react'
import MainStore, { IGetStore } from '../../../store/MainStore'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'
import Message from './Message'

export interface IMessageScreenContainerProps {}

@inject('getStore')
@observer
export default class MessageScreenContainer extends React.Component<
    IMessageScreenContainerProps
> {
    mainStore = this.injected.getStore('mainStore')

    private get injected() {
        return this.props as IMessageScreenContainerProps & IGetStore
    }

    @action.bound
    renderScreenContainers() {
        return this.mainStore.currentDialog.map((message) => {
            return <Message message={message} />
        })
    }
    public render() {
        const { currentDialog } = this.mainStore
        return <>{currentDialog.length > 0 && this.renderScreenContainers()}</>
    }
}
