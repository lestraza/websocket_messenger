import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/MainStore'
import FormInput from '../../../Commons/FormInput'
import { action } from 'mobx'
import { IUser } from '../../Auth/store/Auth.interface'

export interface ISettingsClientDataProps {}

@inject('getStore')
@observer
export default class SettingsClientData extends React.Component<
    ISettingsClientDataProps
> {
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ISettingsClientDataProps & IGetStore
    }

    @action.bound
    onChangeSaveValue(e: React.ChangeEvent<HTMLInputElement>) {
        const { saveInputValueNewSettingsForm } = this.authStore
        const value = e.currentTarget.value
        const prop = e.currentTarget.dataset.id
        if (prop) {
            saveInputValueNewSettingsForm(prop as keyof IUser, value)
        }
    }

    @action.bound
    onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { submutNewSettings } = this.authStore
        submutNewSettings()
    }

    public render() {
        const { name, lastname, email, password } = this.authStore.newSettings
        return (
            <form
                className="client-settings__data-change-form form"
                onSubmit={this.onSubmitForm}
            >
                <div className="form-row">
                    <div className="client-settings__data-change-title form-label">
                        Name
                    </div>
                    <FormInput
                        type={'text'}
                        id={'name'}
                        placeholder={name}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={name}
                    />
                </div>

                <div className="form-row">
                    <div className="client-settings__data-change-title form-label">
                        Lastname
                    </div>
                    <FormInput
                        type={'text'}
                        id={'lastname'}
                        placeholder={lastname}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={lastname}
                    />
                </div>

                <div className="form-row">
                    <div className="client-settings__data-change-title form-label">
                        Email
                    </div>
                    <FormInput
                        type={'email'}
                        id={'email'}
                        placeholder={email}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={email}
                    />
                </div>

                <div className="form-row">
                    <div className="client-settings__data-change-title form-label">
                        Password
                    </div>
                    <FormInput
                        type={'password'}
                        id={'password'}
                        placeholder={'Add your new password'}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={password}
                    />
                </div>
                <input
                    type="submit"
                    value="Save"
                    className={'button button--primary button--small'}
                />
            </form>
        )
    }
}
