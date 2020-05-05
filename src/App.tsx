import React from 'react'
import './Resourses/style.scss'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { IGetStore } from './store/MainStore'
import SignIn from './components/Auth/SignIn'
import { inject, observer } from 'mobx-react'
import MainChatPage from './components/Mainchatpage/MainChatPage'
import RegisterClient from './components/Auth/RegisterClient'
import { LoaderSpinner } from './components/Commons/LoaderSpinner'

export interface IAppProps {}
@inject('getStore')
@observer
export default class App extends React.Component<IAppProps> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IAppProps & IGetStore
    }

    render() {
        const { isAuthenticated, isAuthorizing } = this.authStore
        return (
            <div className="wrapper">
                <div className="header"></div>
                <div className="main">
                    <div className="app-container">
                        {!isAuthorizing ? (
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
                        ) : (
                            <LoaderSpinner />
                        )}
                        
                    </div>
                </div>
            </div>
        )
    }
}
