import * as React from 'react'
import SettingsBarHeader from './SettingsBarHeader'
import ClientPicSetting from './ClientPicSetting'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../../store/MainStore'
import SettingsClientData from './ChangeClientData'

export interface ISettingsBarProps {}

@inject('getStore')
@observer
export default class SettingsBar extends React.Component<ISettingsBarProps> {
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as ISettingsBarProps & IGetStore
    }

    public render() {
        return (
            <div className="client-settings">
                <SettingsBarHeader />
                <ClientPicSetting />
                <SettingsClientData />
            </div>
        )
    }
}
