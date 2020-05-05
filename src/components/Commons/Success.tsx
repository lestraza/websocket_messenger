import * as React from 'react';
import { IGetStore } from '../../store/Abstract.store';
import { observer, inject } from 'mobx-react';

export interface ISuccessProps {
    success: string
}

@inject('getStore')
@observer
export default class Success extends React.Component<ISuccessProps> {
   
    private get injected() {
        return this.props as ISuccessProps & IGetStore
    }
  public render() {
    return (
        this.props.success && (
            <div className="message ">{this.props.success}</div>
        )
    );
  }
}
