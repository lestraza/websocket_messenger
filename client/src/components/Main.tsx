import React from 'react'
import Dialog from './Dialog'
import ChatList from './ChatList'

export default class Main extends React.Component{


    render() {
        return (        
            <>
            	<ChatList />
            	<Dialog name={'wefew'}/>
            </>
        )
    }
}