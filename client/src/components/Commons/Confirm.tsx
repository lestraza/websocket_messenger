import * as React from 'react'
import { IUser } from '../Auth/store/Auth.interface'

export interface IConfirmProps {
    onConfirm: () => void
    onReject: () => void
    title: string   
}

export default class Confirm extends React.Component<IConfirmProps> {
    public render() {
        const { title, onConfirm, onReject } = this.props
        return (
            <div>
                <div>{title}</div>
                <div onClick={onConfirm}>Yes</div>
                <div onClick={onReject}>No</div>
            </div>
        )
    }
}
