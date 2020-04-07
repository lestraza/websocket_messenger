import * as React from 'react'
import { inject, observer } from 'mobx-react'
import MainStore from '../store/MainStore'
import { Route, RouteProps, Redirect } from 'react-router-dom'

export interface IProtectedRouteProps extends RouteProps {}

@inject('store')
@observer
export default class ProtectedRoute extends React.Component<
    IProtectedRouteProps
> {
    mainStore = this.injected.store

    private get injected() {
        return this.props as IProtectedRouteProps & { store: MainStore }
    }

    public render() {
        const { isAuthenticated } = this.mainStore

        return isAuthenticated ? (
            <Route {...this.props} />
        ) : (
            <Redirect to={'/signin'} />
        )
    }
}
