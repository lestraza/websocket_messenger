import * as React from 'react'
import { IGetStore } from '../../../store/Abstract.store'
import { inject, observer } from 'mobx-react'

export interface IDeleteAccountModalProps {}

@inject('getStore')
@observer
export default class DeleteAccountModal extends React.Component<
    IDeleteAccountModalProps
> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IDeleteAccountModalProps & IGetStore
    }
    public render() {
        return <div></div>
    }
}
