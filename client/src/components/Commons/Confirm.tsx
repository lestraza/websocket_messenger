import * as React from 'react'

export interface IConfirmProps {
    onConfirm: (e: React.SyntheticEvent<HTMLDivElement>) => void
    onReject: () => void
    title: string
}

export default class Confirm extends React.Component<IConfirmProps> {
    public render() {
        const { title, onConfirm, onReject } = this.props
        return (
            <div className="confirm-dialog">
                <div className="confirm-dialog__header">{title}</div>
                <div className="confirm-dialog__form">
                    <div
                        className="button button--small"
                        onClick={onConfirm}
                    >
                        Yes
                    </div>
                    <div className="button button--small" onClick={onReject}>
                        No
                    </div>
                </div>
            </div>
        )
    }
}
