import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IGetStore } from '../../store/MainStore'
import { action, observable, runInAction } from 'mobx'
import { Link } from 'react-router-dom'
import { RouterProps } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { IUser } from './store/Auth.interface'
import Error from '../Commons/Error'

export interface IRegisterClientProps extends RouterProps {}

@inject('getStore')
@observer
export default class RegisterClient extends React.Component<
    IRegisterClientProps
> {
    mainStore = this.injected.getStore('mainStore')
    authStore = this.injected.getStore('authStore')

    private get injected() {
        return this.props as IRegisterClientProps & IGetStore
    }
  
    componentWillUnmount() {
        this.mainStore.error = ''
    }
    

    @observable
    successfullRegisterNotification: boolean = false

    @action.bound
    public onChangeSaveValue(e: React.ChangeEvent<HTMLInputElement>) {
        const { saveInputValueRegisterForm } = this.authStore
        const value = e.currentTarget.value
        const prop = e.currentTarget.dataset.id
        if (prop) {
            saveInputValueRegisterForm(prop as keyof IUser, value)
        }
    }

    @action.bound
    onSubmitNewClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const { registerNewClient } = this.authStore
        const {
            name,
            lastname,
            email,
            password,
        } = this.authStore.clientRegisterProps
        if (name && lastname && email && password) {
            registerNewClient()
            .then(() => {
                this.props.history.push('/signin')
                this.successfullRegisterNotification = true
            })
            .catch((err) => {
                runInAction(() => {
                    this.mainStore.error = err.error
                })
            }) 
        } else {
            this.mainStore.error = 'Please add all reqiured data!'
        }
    }

    public render() {
        const {
            name,
            lastname,
            email,
            password,
        } = this.authStore.clientRegisterProps
        const { error} = this.mainStore
        
        return (
            <div className="create-account form">
                <Link
                    to={'/signin'}
                    className="button button--small"
                    style={{ position: 'absolute', left: '40px' }}
                >
                    <FontAwesomeIcon icon={faChevronLeft} color={'#989898'} />
                    &nbsp; Sign In
                </Link>
                <p className="create-account__title">Create your account</p>
                <form
                    className="create-account__form"
                    onSubmit={this.onSubmitNewClient}
                >
                    <div className="form-row">
                        <div className="create-account__subtitle form-label">
                            Name
                        </div>
                        <input
                            type="text"
                            value={name}
                            data-id="name"
                            onChange={this.onChangeSaveValue}
                        />
                    </div>
                    <div className="form-row">
                        <div className="create-account__subtitle form-label">
                            Last name
                        </div>
                        <input
                            type="text"
                            data-id="lastname"
                            value={lastname}
                            onChange={this.onChangeSaveValue}
                        />
                    </div>
                    <div className="form-row">
                        <div className="create-account__subtitle form-label">
                            Email address
                        </div>
                        <input
                            type="email"
                            data-id="email"
                            value={email}
                            onChange={this.onChangeSaveValue}
                        />
                    </div>
                    <div className="form-row">
                        <div className="create-account__subtitle form-label">
                            Password
                        </div>
                        <input
                            type="password"
                            data-id="password"
                            value={password}
                            onChange={this.onChangeSaveValue}
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="submit"
                            className="button button--primary"
                            value="Register"
                        />
                    </div>
                </form>
              
                <Error isDisplaying={!!error} error={error}/>
              
                {this.successfullRegisterNotification && !error ? (
                    <div>
                        You have successfully registered! <br />
                        To continue working in the application please
                        <Link to={'/signin'}> sign in</Link>
                    </div>
                ) : null}
                <div className="font-small">
                    By creating an account, you agree to the Terms of Service.
                    For more information about Messenger's privacy practices,
                    see the Messenger Privacy Statement. We'll occasionally send
                    you account-related emails.
                </div>
            </div>
        )
    }
}
