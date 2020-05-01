import * as React from 'react'
import { IGetStore } from '../../store/Abstract.store'
import { inject, observer } from 'mobx-react'

export interface IServerErrorProps {
    error: string
}

@inject('getStore')
@observer
export default class ServerError extends React.Component<IServerErrorProps> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')
    dialogStore = this.injected.getStore('dialogStore')

    private get injected() {
        return this.props as IServerErrorProps & IGetStore
    }
    public render() {
        return <div className="server-error">{this.props.error}</div>
    }
}
