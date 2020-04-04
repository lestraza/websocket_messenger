import * as React from 'react';
import { IUser } from '../store/MainStore';


export interface IChatPreviewProps {
    user: IUser
}

export default class ChatPreview extends React.Component<IChatPreviewProps> {
  public render() {
    return (
      <div className='chat_preview'>
        <div className='user_pic'> <img src={this.props.user.avatarUrl} alt=""/>
        </div>
        
        {`userName: ${this.props.user.name} ${this.props.user.lastName}`}
      </div>
    );
  }
}
