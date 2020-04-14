import * as React from 'react'

export interface IFormInputProps {
    type: string
    id: string
    required: boolean
    placeholder?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className: string
    value?: any
}

export default class FormInput extends React.Component<IFormInputProps> {
    public render() {
        const { type, placeholder, id, onChange, className, value } = this.props
        return (
            <input
                type={type}
                placeholder={placeholder}
                data-id={id}
                required={false}
                onChange={onChange}
                className={className}
                value={value}
            />
        )
    }
}
