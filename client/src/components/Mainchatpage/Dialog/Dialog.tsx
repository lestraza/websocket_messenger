import React, { Component } from 'react'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/MainStore'
import MessageScreenContainer from './MessageScreenContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faSmile } from '@fortawesome/free-regular-svg-icons'
import AddContact from '../Contacts/AddContact'
import defaultUserPic from '../../../assets/default-user.png'

export interface IDialogProps {}
@inject('getStore')
@observer
export default class Dialog extends Component<IDialogProps> {
    mainStore = this.injected.getStore('mainStore')
    dialogStore = this.injected.getStore('dialogStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IDialogProps & IGetStore
    }

    @action.bound
    formSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        this.dialogStore.sendMessage()
    }

    @action.bound
    onChangeSaveValue(e: React.FormEvent<HTMLInputElement>) {
        const { saveNewMessage } = this.dialogStore
        const value = e.currentTarget.value
        saveNewMessage(value)
    }
    public render() {
        const { newMessage } = this.dialogStore
        const { isShowAddContactModal } = this.dialogStore
        const { name, lastname, avatarUrl } = this.authStore.client
        return (
            <div className="dialog">
                <div className="dialog__header">
                    <div className="usercard usercard--small">
                        <div
                            className="usercard__pic"
                            style={{
                                backgroundImage: `url(${
                                    avatarUrl ? avatarUrl : defaultUserPic
                                })`,
                            }}
                        ></div>
                        <div className="usercard__info">{`${name} ${lastname}`}</div>
                    </div>
                </div>
                <div className="dialog__screen">
                    <MessageScreenContainer />
                </div>
                <form
                    className="dialog__type-message"
                    onSubmit={this.formSubmit}
                >
                    <input
                        type="text"
                        placeholder="Enter your message"
                        onChange={this.onChangeSaveValue}
                        className="dialog__input"
                        value={newMessage}
                    />
                    <input id={'submit'} type="submit"></input>
                    <label
                        htmlFor="submit"
                        className="dialog__send-message-button"
                    >
                        <FontAwesomeIcon icon={faPaperPlane} color={'#FFF'} />
                    </label>
                    <div className="dialog__emodji">
                        <FontAwesomeIcon
                            icon={faSmile}
                            color={'#bababa'}
                            size={'lg'}
                        />
                    </div>
                </form>
                {isShowAddContactModal && <AddContact />}
            </div>
        )
    }
}
