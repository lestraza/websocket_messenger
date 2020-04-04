import * as React from "react";
import { inject, observer } from "mobx-react";
import MainStore, { IMessage } from "../store/MainStore";
import { computed } from "mobx";

export interface IMessageProps {
    message: IMessage
}

@inject('store')
@observer
export default class Message extends React.Component<IMessageProps> {
  mainStore = this.injected.store;

  private get injected() {
    return this.props as IMessageProps & { store: MainStore };
  }

  @computed
  private get isOutgoing() {
      const { clientId } = this.mainStore
      const { message } = this.props;
      return message.userId === clientId
  }

  @computed
  private get currentDate() {
    const { timeStamp } = this.props.message;
    const date = new Date(timeStamp)
    return date.toLocaleString('ru', {
        hour: '2-digit',
        minute: '2-digit'
    })
  }

  public render() {
    const { fullName, text, } = this.props.message;
    return (
        <div className={`message_screen_container ${this.isOutgoing? 'outgoing' : 'incoming'}`}>
          <div className="message_screen_container__user_name">
            {fullName}
          </div>
          <div className="message_screen_container__message">
            {text}
            <div className="message_screen_container__time_stamp">
              {this.currentDate}
            </div>
          </div>
        </div>
        )
  }
}
