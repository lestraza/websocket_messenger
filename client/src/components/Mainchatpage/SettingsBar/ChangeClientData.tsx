import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/MainStore'
import FormInput from '../../../Commons/FormInput'
import { action } from 'mobx'
import { IChangeSettingsProps } from './store/Settings.store'

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
            saveInputValueNewSettingsForm(
                prop as keyof IChangeSettingsProps,
                value
            )
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
                className="client-settings__data-change-form"
                onSubmit={this.onSubmitForm}
            >
                <div className="client-settings__data-change-box">
                    <div className="client-settings__data-change-title">
                        Name
                    </div>
                    <FormInput
                        type={'text'}
                        id={'name'}
                        placeholder={'Add your new name'}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={name}
                    />
                </div>

                <div className="client-settings__data-change-box">
                    <div className="client-settings__data-change-title">
                        Lastname
                    </div>
                    <FormInput
                        type={'text'}
                        id={'lastname'}
                        placeholder={'Add your new lastname'}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={lastname}
                    />
                </div>

                <div className="client-settings__data-change-box">
                    <div className="client-settings__data-change-title">
                        Email
                    </div>
                    <FormInput
                        type={'text'}
                        id={'email'}
                        placeholder={'Add your new email'}
                        required={false}
                        onChange={this.onChangeSaveValue}
                        className={'client-settings__data-change-prop'}
                        value={email}
                    />
                </div>

                <div className="client-settings__data-change-box">
                    <div className="client-settings__data-change-title">
                        Password
                    </div>
                    <FormInput
                        type={'text'}
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
                    value="SUBMIT"
                    className={'client-settings__form-submit'}
                />
            </form>
        )
    }
}
