import * as React from 'react';
import { inject, observer } from 'mobx-react';
import MainStore from '../../store/MainStore';

export interface IModalProps {
}

@inject('store')
@observer
export default class Modal extends React.Component<IModalProps> {
    mainStore = this.injected.store;

    private get injected() {
        return this.props as IModalProps & { store: MainStore }
    }
  public render() {
    return (
      <div>
        
      </div>
    );
  }
}
