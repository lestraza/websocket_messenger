import React from 'react'
import './style.scss'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ChatList from './components/ChatList'
import Dialog from './components/Dialog'
import MainStore from './store/MainStore'
import SignIn from './components/Auth/SignIn'
import { inject } from 'mobx-react'
import MainChatPage from './components/MainChatPage'
import RegisterClient from './components/Auth/RegisterClient'
import ProtectedRoute from './router/ProtectedRoute'

export interface IAppProps {}
@inject('store')
export default class App extends React.Component<IAppProps> {
    mainStore = this.injected.store

    private get injected() {
        return this.props as IAppProps & { store: MainStore }
    }

    render() {
        return (
            <div className="wrapper">
                <div className="header"></div>
                <div className="main">
                    <div className="app-container">
                        <BrowserRouter>
                            <Switch>
                                <ProtectedRoute
                                    path={'/'}
                                    exact
                                    component={MainChatPage}
                                />
                                <Route
                                    path={'/signin'}
                                    exact
                                    component={SignIn}
                                />
                                <Route
                                    path={'/register'}
                                    exact
                                    component={RegisterClient}
                                />
                            </Switch>
                        </BrowserRouter>
                    </div>
                </div>
            </div>
        )
    }
}
