import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/MainStore'
import { computed, observable } from 'mobx'
import { IMessage } from './store/Dialog.interface'

export interface IMessageProps {
    message: IMessage
}

@inject('getStore')
@observer
export default class Message extends React.Component<IMessageProps> {
    authStore = this.injected.getStore('authStore')
    dialogStore = this.injected.getStore('dialogStore')

    private get injected() {
        return this.props as IMessageProps & IGetStore
    }

    @observable
    public messageElement: React.RefObject<HTMLDivElement> = React.createRef()

    componentDidMount() {
        const element = this.messageElement.current
        if(element) {
            this.dialogStore.scrollToItem(element)
        } 
    }

    @computed
    private get isOutgoing() {
        const { id } = this.authStore.client
        const { message } = this.props
        return message.id === id
    }

    @computed
    private get currentDate() {
        const { timeStamp } = this.props.message
        const date = new Date(timeStamp)
        return date.toLocaleString('ru', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    public render() {
        const { name, lastname, text } = this.props.message
        return (
            <div
                className={`message-screen-container ${
                    this.isOutgoing ? 'outgoing' : 'incoming'
                }`}
                
            >
                <div className="message-screen-container__user_name">
                    {`${name} ${lastname}`}
                </div>
                <div className="message-screen-container__message" ref={this.messageElement}>{text}</div>
                <div className="message-screen-container__time_stamp">
                    {this.currentDate}
                </div>
            </div>
        )
    }
}
