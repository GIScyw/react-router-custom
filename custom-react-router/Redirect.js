import React from 'react'
import ReactDOM from 'react-dom'
import {Consumer} from './context'
/*Redirect组件与Link组件不同的是它不需要点击后才进行跳转，只要遇到该组件即可跳转，其实就是执行了history.push*/
export  default class Redirect extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <Consumer>
            {state => {
                state.history.push(this.props.to);
                return null;
        }

            }
            </Consumer>
        )
    }
}
