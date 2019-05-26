import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from './context'

export default class HashRouter extends Component {
    constructor(){
        super();
        this.state = {
            location:{
                pathname: window.location.hash.slice(1) || ''
            }
        }
    }

    componentDidMount(){
        window.location.hash=window.location.hash || '/'
        window.addListener('hashChange', ()= >{
            this.setState({
            location:{
                ...this.state.location,
                pathname: window.location.hash.slice(1) || '/'
            }
        })
        })
    }

    render(){
       /* HashRouter本身并不是一个UI组件，它只是将属性传递给子组件；
        HashRouter的作用就是将location和history对象通过Provider注入到子组件中，让它们可以用到这些属性，
        因为要将最新的location信息传递给子组件，HashRouter需要通过hashChange事件来监听url中hash的变化；
        history主要是提供push，replace等方法；location主要提供pathname等属性；*/
        let value={
            location:this.state.location,
            history:{
                push(to){
                    window.location.hash=to;
            }
        }
        }
        return(
            <Provider value={value}>
            {this.props.children}
            </Provider>
        )

    }
}
