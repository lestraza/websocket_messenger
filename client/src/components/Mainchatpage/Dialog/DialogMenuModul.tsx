import * as React from 'react'
import { IGetStore } from '../../../store/Abstract.store'
import { observer, inject } from 'mobx-react'
import { action } from 'mobx'

export interface IDialogMenuModalProps {}

@inject('getStore')
@observer
export default class DialogMenuModal extends React.Component<
    IDialogMenuModalProps
> {
    dialogStore = this.injected.getStore('dialogStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IDialogMenuModalProps & IGetStore
    }
    @action.bound
    onClickDeleteContact() {
        const { deleteContact } = this.dialogStore
        deleteContact()
    }

    public render() {
        return (
            <div className="dialog-menu-modal">
                <div
                    className="dialog-menu-modal__item"
                    onClick={this.onClickDeleteContact}
                >
                    Delete contact
                </div>
                <div className="dialog-menu-modal__item">Delete chat</div>
            </div>
        )
    }
}
