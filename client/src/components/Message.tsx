import * as React from "react";
import { inject, observer } from "mobx-react";
import MainStore, { IMessage } from "../store/MainStore";
import { computed } from "mobx";

export interface IMessageProps {
    message: IMessage
}

@inject("store")
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
    const { message } = this.props;
    const date = new Date(message.timeStamp)
    const formatedDate = date.toLocaleString('ru', {
        hour: '2-digit',
        minute: '2-digit'
    })
    return formatedDate
  }

  public render() {
    const { message } = this.props;
    return (
        <div className={`message_screen_container ${this.isOutgoing? 'outgoing' : 'incoming'}`}>
          <div className="message_screen_container__user_name">
            {message.fullName}
          </div>
          <div className="message_screen_container__message">
            {message.text}
            <div className="message_screen_container__time_stamp">
              {this.currentDate}
            </div>
          </div>
        </div>
        )
  }
}
