import React, { Component, FormEventHandler} from 'react';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import MainStore from '../store/MainStore';
import MessageScreenContainer from './MessageScreenContainer';

export interface IDialogProps {

}
@inject('store') @observer
export default class Dialog extends Component<IDialogProps> {

  mainStore = this.injected.store;

  private get injected() {
      return this.props as IDialogProps & { store: MainStore }
  }

  @action.bound
  formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    this.mainStore.sendMessage()
  }
    
  @action.bound
  onChangeSaveValue(e: React.FormEvent<HTMLInputElement>) {
    const { saveNewMessage } = this.mainStore
    const value = e.currentTarget.value
    saveNewMessage(value)
  }
  public render() {
      const { newMessage } = this.mainStore
    return (
      <div className='dialog'>
        <div className="dialog_header"></div>
        <div className="dialog_screen">
          <MessageScreenContainer />
        </div>
        <form className='dialog_type_message' onSubmit={this.formSubmit}>
          <div className='dialog_emodji'></div>
          <input 
          type="text" placeholder='Enter your message' 
          onChange={this.onChangeSaveValue} className='dialog_input' value={newMessage}
          />
          <input type='submit' className='dialog_send_message_button' />
        </form>
      </div>
    );
  }
}
