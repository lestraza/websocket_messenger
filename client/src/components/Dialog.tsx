import React, { Component} from 'react';

export interface IDialogProps {
    name: string
}

export default class Dialog extends Component<IDialogProps> {
    
  public render() {
      this.props.name
    return (
      <div>
        
      </div>
    );
  }
}
