import React, { Component } from 'react'
import { action } from 'mobx'
import { inject, observer } from 'mobx-react'
import MainStore from '../store/MainStore'
import MessageScreenContainer from './MessageScreenContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faSmile } from '@fortawesome/free-regular-svg-icons'

export interface IDialogProps {}
@inject('store')
@observer
export default class Dialog extends Component<IDialogProps> {
    mainStore = this.injected.store

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
            <div className="dialog">
                <div className="dialog__header"></div>
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
            </div>
        )
    }
}
