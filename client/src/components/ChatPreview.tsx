import * as React from 'react';
import { IUser } from '../store/MainStore';


export interface IChatPreviewProps {
    user: IUser
}

export default class ChatPreview extends React.Component<IChatPreviewProps> {
  public render() {
    return (
      <div>
        {`userName: ${this.props.user.name} ${this.props.user.lastName}`}
      </div>
    );
  }
}
