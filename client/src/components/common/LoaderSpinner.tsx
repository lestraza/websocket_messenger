import * as React from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

export interface ILoaderSpinnerProps {}

export class LoaderSpinner extends React.Component<ILoaderSpinnerProps> {
    render() {
        return (
            <div className="spinner-wrapper">
                <Loader type={'ThreeDots'} color={'#4d7d96'} />
            </div>
        )
    }
}
