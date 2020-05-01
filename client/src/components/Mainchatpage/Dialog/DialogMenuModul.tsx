import * as React from 'react'
import { IGetStore } from '../../../store/Abstract.store'
import { observer, inject } from 'mobx-react'
import { action, observable } from 'mobx'
import Confirm from '../../Commons/Confirm'

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

    @observable
    private hasShowComfirm: boolean = false

    @action.bound
    onClickShowConfirm() {
        if(!this.hasShowComfirm) {
            this.hasShowComfirm = true
        } else {
            this.hasShowComfirm = false
        }        
    }

    @action.bound
    private onClickDeleteContact() {
        const { deleteContact } = this.dialogStore
        deleteContact()
    }

    public render() {
        return (
            <div className="dialog-menu-modal">
                <div
                    className="dialog-menu-modal__item"
                    onClick={this.onClickShowConfirm}
                >
                    Delete contact
                </div>
                {this.hasShowComfirm ? (<Confirm
                    title={`Are you sure delete this contact?`}
                    onConfirm={this.onClickDeleteContact}
                    onReject={this.onClickShowConfirm}
                />) : ''}
                
                <div className="dialog-menu-modal__item">Delete chat</div>
            </div>
        )
    }
}
