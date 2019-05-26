import React from 'react'
import createContext from 'create-react-context'
import {createBrowserHistory as createHistory} from 'history';

import {Provider} from './context';

/* BrowserRouter本身并不是一个UI组件，它只是将属性传递给子组件；
       BrowserRouter的作用就是将location，history和match对象通过Provider注入到子组件中，让它们可以用到这些属性，
       history主要是提供push，replace等方法；location主要提供pathname等属性；*/
export default class HashRouter extends React.Component {

    history=createHistory(this.props);

    static computerRootMatch(pathname){
        return{path:'/',url:'/',params:{},isExact:pathname==='/'};
    }


    constructor() {
        super(props);
        this.state = {
            location: props.history.location
        };

            render()
           {

            return (
                <Provider
                    children = {this.props.children || null}
                    value = {
                  {
                        history:this.history,
                        location:this.state.location,
                        match:Router.computeRootMatch(this.state.location.pathname)
                  }
                }
            />
        )
        }

    }
}



