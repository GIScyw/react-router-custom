import React from 'react'
import ReactDOM from 'react-dom'
import {Consumer} from './context'

/*Link组件返回a标签，然后通过history.push方法进行路由跳转*/
export default class Link extends React.Component {
    constructor(){
        super();
    }

    render(){
    return(
        <Consumer>
        {state =>{
            return <a onClick={()=>
            {
                state.history.push(this.props.to);
            }}>{this.props.children}</a>
        }}
        </Consumer>
    )
    }
}
