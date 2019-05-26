import React from 'react'
import ReactDOM from 'react-dom'
import {Consumer} from './context'
import pathToReg from 'path-to-regexp'
/*Router组件主要是返回Component组件，并为Component组件注入一些属性*/
export default class Router extends React.Component {
    constructor(){
        super();
    }

    render(){
        return(
            <Consumer>
            {state = >{
                let { path, component: Component,exact = false} =this.props;
                let pathname = state.location.pathname;
                let keys = [];
                let regs = pathToReg(path,keys,{end:exact});
                keys = keys.map(item=>item.name);
                let result =pathname.match(reg);
                let [url,...values]=result || [];
                let props = {
                    location: state.location,
                    history: state.history,
                    match:{
                        params: keys.reduce((obj,current,index) =>{
                            obj[current] = values[index];
                            return obj;
        },{})
                    }
                }
                if(result){
                    return <Component {...props}></Component>
                }
            }
            }
            </Consumer>
        )
    }

}
