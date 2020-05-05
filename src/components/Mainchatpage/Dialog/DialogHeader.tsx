import * as React from 'react'
import { IGetStore } from '../../../store/Abstract.store'
import { observer, inject } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'
import { action } from 'mobx'
import DialogMenuModal from './DialogMenuModul'
import AvatarImg from '../../Commons/AvatarImg'

export interface IDialogHeaderProps {}

@inject('getStore')
@observer
export default class DialogHeader extends React.Component<IDialogHeaderProps> {
    dialogStore = this.injected.getStore('dialogStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IDialogHeaderProps & IGetStore
    }

    @action.bound
    onClickShowDialogMenu(e: React.SyntheticEvent<HTMLDivElement>) {
        e.stopPropagation()
        this.dialogStore.isShowDialogMenu = true
    }

    @action.bound
    closeDialogMenu(e: MouseEvent) {
        e.stopPropagation()
        this.dialogStore.isShowDialogMenu = false
    }

    componentDidMount() {
        window.addEventListener('click', this.closeDialogMenu)
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.closeDialogMenu)
    }

    public render() {
        const { name, lastname } = this.authStore.client
        const { currentContact } = this.dialogStore
        
        return (
            <div className="dialog__header">
                <div className="usercard usercard--small">
                    <AvatarImg
                        className="usercard__pic"
                        user={this.authStore.client}
                    />
                    <div className="usercard__info">{`${name} ${lastname}`}</div>
                </div>
                {currentContact.id && (
                    <div
                        className="dialog__header-menu"
                        onClick={this.onClickShowDialogMenu}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisV}
                            color={'#8a9aa2'}
                            size={'lg'}
                        />
                    </div>
                )}
                {this.dialogStore.isShowDialogMenu && <DialogMenuModal />}
            </div>
        )
    }
}
