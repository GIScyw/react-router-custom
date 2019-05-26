import React ,{Component} from 'react'
import ReactDOM from 'react-dom'
import {Consumer} from './context';
import pathToRegExp from 'path-to-regexp'

/*Switch就是遍历Switch组件的子组件（this.props.children)找出第一个满足state.location.pathname==child.props.path的子组件*/
export default class Switch extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <Consumer>
            {state=>{
            {
                let pathname=state.location.pathname;
                let children =this.props.children;
                for (var i=0;i<children.length;i++){
                    let child =children[i];
                    //Redirect组件可能没有path属性
                    let path=child.props.path || '';
                    let reg=pathToRegExp(path,[],{end,false});
                    if(reg.test(pathname)){
                        return child;
                    }
                }
                return null;
            }
        }


            }
            </Consumer>
        )
    }
}
