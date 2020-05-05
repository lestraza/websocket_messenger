import * as React from 'react'
import { IGetStore } from '../../store/Abstract.store'
import { inject, observer } from 'mobx-react'

export interface IErrorProps {    
    error: string
}

@inject('getStore')
@observer
export default class Error extends React.Component<IErrorProps> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')
    dialogStore = this.injected.getStore('dialogStore')

    private get injected() {
        return this.props as IErrorProps & IGetStore
    }
    public render() {
        return (
            this.props.error && (
                <div className="message message--error">{this.props.error}</div>
            )
        )
    }
}
