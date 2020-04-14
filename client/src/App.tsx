import React from 'react'
import './style.scss'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import MainStore from './store/MainStore'
import SignIn from './components/Auth/SignIn'
import { inject, observer } from 'mobx-react'
import MainChatPage from './components/Mainchatpage/MainChatPage'
import RegisterClient from './components/Auth/RegisterClient'

export interface IAppProps {}
@inject('store')
@observer
export default class App extends React.Component<IAppProps> {
    mainStore = this.injected.store

    private get injected() {
        return this.props as IAppProps & { store: MainStore }
    }

    render() {
        const { isAuthenticated } = this.mainStore
        return (
            <div className="wrapper">
                <div className="header"></div>
                <div className="main">
                    <div className="app-container">
                        <BrowserRouter>
                            <Switch>
                                <Route path={'/'} exact>
                                    {!isAuthenticated ? (
                                        <Redirect to={'/signin'} />
                                    ) : (
                                        <MainChatPage />
                                    )}
                                </Route>
                                <Route
                                    path={'/register'}
                                    exact
                                    component={RegisterClient}
                                />
                                <Route path={'/signin'} exact>
                                    {' '}
                                    {isAuthenticated ? (
                                        <Redirect to={'/'} />
                                    ) : (
                                        <SignIn />
                                    )}{' '}
                                </Route>
                            </Switch>
                        </BrowserRouter>
                    </div>
                </div>
            </div>
        )
    }
}
