**React Router**系列分为三个部分，**React Router基础内容**，**React Router从V2/V3到V4的变化**，**React Router实现原理**。

> 下面未说明的都指的是React Router V4，用到的包是```react-router-dom```

### React Router的特性

路由的基本原理就是保证view和url同步，```React-Router```有下面一些特点

- **声明式的路由**
  跟react一样，我们可以声明式的书写router，可以用```JSX```语法

- **嵌套路由及路径匹配**

- **支持多种路由切换方式**

  可以用```hashchange```或者```history.putState```。

  ```hashChange```的兼容性较好，但在浏览器地址栏显示#看上去会很丑；而且hash记录导航历史不支持```location.key```和```location.state```。```hashHistory```即```hashChange```的实现。

  ```history.putState```可以给我们提供优雅的url，但需要额外的服务端配置解决路径刷新问题；```browserHistory```即```history.pushState```的实现。

  因为两种方式都有优缺点，我们可以根据自己的业务需求进行挑选，这也是为什么我们的路由配置中需要从```react.router```引入```browserHistory```并将其当作props传给Router。

### React Router的包

![img](https://user-gold-cdn.xitu.io/2019/1/5/1681d40473afe198?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

```react—router```实现了路由的核心功能，在V4之前（V2，V3）可以使用它，而```react-router-dom```基于```react-router```，加入了再浏览器环境下的一些功能，例如```Link组件```,```BroswerRouter和HashRouter组件```这类的DOM类组件,所以如果用到DOM绑定就使用```react-router-dom```,实际上```react-router```是```react-router-dom```的子集，所以在新版本中我们使用```react-router-dom```就行了，不需要使用```react-router```.```react-router-native```在React Native中用到。

> react-router-redux没有集成进来

### React  Router的API

```React-Router```的API主要有

| **BrowserRouter** | **HashRouter** | **MemoryRouter** | **StaticRouter** |
| ----------------- | -------------- | ---------------- | ---------------- |
| **Link**          | **NavLink**    | **Redirect**     | **Prompt**       |
| **Route**         | **Router**     | **Swith**        |                  |

这些组件的具体用法可以在[react-router官网](https://reacttraining.com/react-router)和[segmentfault一篇文章](https://segmentfault.com/a/1190000014294604)查看，这里对它们做个总结：

```BrowserRouter```使用HTML5提供的```History api(putState,replaceState和popState事件)```来保持UI和URL的同步.

```HashRouter```使用```URL的hash部分（即window.location.hash)```来保持UI和URL的同步；```HashRouter```主要用于支持低版本的浏览器，因此对于一些新式浏览器，我们鼓励使用```BrowserHistory```。

```MemoryRouter```将历史记录保存在内存中，这个在测试和非浏览器环境中很有用，例如```react native```。

```StaticRouter```是一个永远不会改变位置的Router，这在服务端渲染场景中非常有用，因为用户实际上没有点击，所以位置时间上没有发生变化。

```NavLink```与```Link```的区别主要在于，前者会在与URL匹配时为呈现要素添加样式属性。

```Route```是这些组件中重要的组件，它的任务就是在其```path属性```与某个```location```匹配时呈现一些UI。

对于```Router```，一般程序只会使用其中一个高阶```Router```，包括```BrowserRouter，HashRouter，MemoryRouter，NativeRouter和StaticRouter```；

```Switch```用于渲染与路径匹配的第一个```Route```或```Redirect```。

### React Router基本用法—基本路由

#### 基本操作

两个页面```home```和```detail```

```javascript
//home.js
import React from 'react

export default class Home extends React.Component {
    render(){
        return (
        <div>
           <a>调转到detail页面</a>
         </div>
        )
    }
}
```

```javascript
//detail.js
import React from 'react'

export default class Home extends React.Component {
    render(){
        return(
        <div>
          <a>跳转到home页面</a>
        </div>
        )
    }
}
```

```javascript
//Route.js
import React from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import Home from '../home'
import Detail from '../detail'

const BasicRoute = () => (
<HashRouter>
     <Switch>
       <Route exact path='/' component={Home} />
       <Route exact path='/detail' component={Detail} />
      </Switch>
 </HashRouter>
)

export default BasicRoute;
```

```javascript
//index.js
import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router/router'

ReactDOM.render(
<Router/>,
document.getElementById('root')
)
```

#### 通过a标签跳转

修改```home.js```和```detail.js```

```javascript
//home.js
import React from 'react'

export default class Home extends React.Component {
    render(){
        return(
        <div>
           <a href='#/detail'>跳转到detail页面</a>
        </div>
        )
    }
}
```

```javascript
//detail.js
import React from 'react';


export default class Home extends React.Component {
    render() {
        return (
            <div>
                <a href='#/'>回到home</a>
            </div>
        )
    }
}
```

#### 通过函数跳转

首先需要修改```router.js```中的代码

```javascript
...
import {HashRouter, Route, Switch, hashHistory} from 'react-router-dom';
...
<HashRouter history={hashHistory}>
...
```

然后在```home.js```中

```javascript
export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <a href='#/detail'>去detail</a>
                <button onClick={() => this.props.history.push('detail')}>通过函数跳转</button>
            </div>
        )
    }
}
```

### 传参

很多场景下，我们还需要在页面跳转的同时传递参数，在```react-router-dom```中，同样提供了两种方式进行传参：

**url传参和通过push函数隐式传参**

##### url传参

修改route.js中的代码

```javascript
...
<Route exact path="/detail/:id" component={Detail}/>
...
```

然后修改detail.js，使用this.props.match.params来获取url传过来的参数

```javascript
...
componentDidMount() {
    console.log(this.props.match.params);
}
...
```

在地址栏输入“[http://localhost:3000/#/detail/3](https://link.jianshu.com/?t=http%3A%2F%2Flocalhost%3A3000%2F%23%2Fdetail%2F3)”，打开控制台：

![img](https://upload-images.jianshu.io/upload_images/6334988-28182a2ede7ea1f3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/421/format/webp)



##### 隐式传参

修改home.js

```javascript
import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <a href='#/detail/3'>去detail</a>
                    <button onClick={() => this.props.history.push({
                        pathname: '/detail',
                        state: {
                            id: 3
                        }
                })}>通过函数跳转</button>
            </div>
        )
    }
}
```

在detai.js中，就可以使用this.props.location.state获取home传过来的参数

```javascript
componentDidMount() {
    //console.log(this.props.match.params);
    console.log(this.props.history.location.state);
}
```

跳转后打开控制台可以看到参数被打印：![img](https://upload-images.jianshu.io/upload_images/6334988-e7b04222dd82d74f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/365/format/webp)

#### 其他函数

##### replace

有些场景下，重复使用push或a标签跳转会产生死循环，为了避免这种情况出现，react-router-dom提供了replace。在可能会出现死循环的地方使用replace来跳转：

```javascript
this.props.history.replace('/detail');
```

##### goBack

场景中需要返回上级页面的时候使用：

```javascript
this.props.history.goBack();
```

### React Router的基本用法—动态路由

React Router V4 实现了动态路由。

> 对于大型应用来说，一个首当其冲的问题就是所需加载的JavaScript的大小。程序应当只加载当前渲染页所需的JavaScript。有些开发者将这种方式称之为“代码分拆” —— 将所有的代码分拆成多个小包，在用户浏览过程中按需加载。React-Router 里的路径匹配以及组件加载都是异步完成的，不仅允许你延迟加载组件，并且可以延迟加载路由配置。Route可以定义 getChildRoutes，getIndexRoute 和 getComponents 这几个函数。它们都是异步执行，并且只有在需要时才被调用。我们将这种方式称之为 “逐渐匹配”。 React-Router 会逐渐的匹配 URL 并只加载该URL对应页面所需的路径配置和组件。

```javascript
const CourseRoute = {
  path: 'course/:courseId',

  getChildRoutes(location, callback) {
    require.ensure([], function (require) {
      callback(null, [
        require('./routes/Announcements'),
        require('./routes/Assignments'),
        require('./routes/Grades'),
      ])
    })
  },

  getIndexRoute(location, callback) {
    require.ensure([], function (require) {
      callback(null, require('./components/Index'))
    })
  },

  getComponents(location, callback) {
    require.ensure([], function (require) {
      callback(null, require('./components/Course'))
    })
  }
}

```

### React Router的基本用法—嵌套路由

如果我们给```/```,```/category```和```/products```创建了路由，但如果我们想要```/category/shoes```,```/category/boots```,```/category/footwear```这种形式的url呢？在```React Router V4```之前的版本中，我们的做法是利用Route组件的上下层嵌套：

```javascript
 <Route exact path="/" component={Home}/>
 <Route path="/category" component={Category}/>
   		<Route path='/category/shoes' component={Shoes}/>
   		<Route path='/category/boots' component={Boots}/>
   		<Route path='/category/footwear' component={Footwear}/>
 <Route path="/products" component={Products}/>
   
```

那么在V4版本中该怎么实现嵌套路由呢,我们可以将嵌套的路由放在父元素里面定义。

```javascript
//app.js
import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom
import Category from './Category'

class App extends Component {
    render(){
        return(
         <div>
        <nav className="navbar navbar-light">
          <ul className="nav navbar-nav">
            <li><Link to="/">Homes</Link></li>
            <li><Link to="/category">Category</Link></li>
            <li><Link to="/products">Products</Link></li>
          </ul>
       </nav>
 
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/category" component={Category}/>
      <Route path="/products" component={Products}/>
    </Switch>
    </div>
        )
    }
}

export default App;
```

```javascript
//Category.jsx

import React from 'react';
import { Link, Route } from 'react-router-dom';
 
const Category = ({ match }) => {
return( <div> <ul>
    <li><Link to={`${match.url}/shoes`}>Shoes</Link></li>
    <li><Link to={`${match.url}/boots`}>Boots</Link></li>
    <li><Link to={`${match.url}/footwear`}>Footwear</Link></li>
 
  </ul>
  <Route path={`${match.path}/:name`} render= {({match}) =>( <div> <h3> {match.params.name} </h3></div>)}/> //嵌套路由
  </div>)
}
export default Category;
```

我们需要理解上面的```match```对象，当路由路径和当前路径成功匹配时会产生match对象，它有如下属性：

- **match.url:** 返回路由路径字符串,常用来构建```Link```路径
- **match.path:** 返回路由路径字符串，常用来构建```Route```路径
- **match.isExact:** 返回布尔值，如果准确（没有任何多余字符）匹配则返回true
- **match.params:** 返回一个对象包含```Path-to-RegExp```包从URL解析测键值对

注意```match.url```和```match.path```没有太大区别，控制台经常出现相同的输出，例如访问```/user```

```javascript
const UserSubLayout = ({ match }) => {
  console.log(match.url)   // output: "/user"
  console.log(match.path)  // output: "/user"
  return (
    <div className="user-sub-layout">
      <aside>
        <UserNav />
      </aside>
      <div className="primary-content">
        <Switch>
          <Route path={match.path} exact component={BrowseUsersPage} />
          <Route path={`${match.path}/:userId`} component={UserProfilePage} />
        </Switch>
      </div>
    </div>
  )
}
//注意这里match在组件的参数中被解构，意思就是我们可以使用match.path代替props.match.path
```

一般的，我们在构建``Link``组件的路径时用```match.url```,在构建```Route```组件的路径时用```match.path```

还有一个地方需要理解的是```Route```组件有三个可以用来定义要渲染内容的props:

- **component:** 当URL匹配时，```router```会将传递的组件使用```React.createElement```来生成一个React元素
- **render：**适合行内渲染，在当前路径匹配路由路径时，```renderprop```期望一个函数返回一个元素
- **children：** ```childrenprop```跟```render```很类似，也期望一个函数返回一个React元素。然而，不管路径是否匹配，children都会渲染。

### React Router的基本用法—带path参数的嵌套路由

一个真实的路由应该是根据数据，然后动态显示。假设我们获取了从服务端API返回的product数据，如下所示

```javascript
//Product.jsx

const productData = [
{
  id: 1,
  name: 'NIKE Liteforce Blue Sneakers',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie.',
  status: 'Available'
 
},
{
  id: 2,
  name: 'Stylised Flip Flops and Slippers',
  description: 'Mauris finibus, massa eu tempor volutpat, magna dolor euismod dolor.',
  status: 'Out of Stock'
 
},
{
  id: 3,
  name: 'ADIDAS Adispree Running Shoes',
  description: 'Maecenas condimentum porttitor auctor. Maecenas viverra fringilla felis, eu pretium.',
  status: 'Available'
},
{
  id: 4,
  name: 'ADIDAS Mid Sneakers',
  description: 'Ut hendrerit venenatis lacus, vel lacinia ipsum fermentum vel. Cras.',
  status: 'Out of Stock'
},
 
];
```

我们需要根据下面这些路径创建路由：

- `/products`. 这个路径应该展示产品列表。
- `/products/:productId`.如果产品有`:productId`，这个页面应该展示该产品的数据，如果没有，就该展示一个错误信息。

```javascript
//Products.jsx

const Products = ({ match }) => {
 
   const productsData = [
    {
        id: 1,
        name: 'NIKE Liteforce Blue Sneakers',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie.',
        status: 'Available'
 
    },
 
    //Rest of the data has been left out for code brevity
 
];
 /* Create an array of `<li>` items for each product
  var linkList = productsData.map( (product) => {
    return(
      <li>
        <Link to={`${match.url}/${product.id}`}>
          {product.name}
        </Link>
      </li>
      )
 
    })
 
  return(
    <div>
        <div>
         <div>
           <h3> Products</h3>
           <ul> {linkList} </ul>
         </div>
        </div>
 
        <Route path={`${match.url}/:productId`}
            render={ (props) => <Product data= {productsData} {...props} />}/>
        <Route exact path={match.url}
            render={() => (
            <div>Please select a product.</div>
            )}
        />
    </div>
  )
}
```

下面是Product组件的代码

```javascript
//Product.jsx

const Product = ({match,data}) => {
  var product= data.find(p => p.id == match.params.productId);
  var productData;
 
  if(product)
    productData = <div>
      <h3> {product.name} </h3>
      <p>{product.description}</p>
      <hr/>
      <h4>{product.status}</h4>  </div>;
  else
    productData = <h2> Sorry. Product doesnt exist </h2>;
 
  return (
    <div>
      <div>
         {productData}
      </div>
    </div>
  )
}
```

### React Router的基本用法—保护式路由

考虑到这样一个场景，用户必须先验证登录状态才能进入到主页，所以需要保护式路由，这里需要保护的路由是Admin，如果登录没通过则先进入Login路由组件。保护式路由会用到重定向组件Redirect，如果有人已经注销了账户，想进入`/admin`页面，他们会被重定向到`/login`页面。当前路径的信息是通过state传递的，若用户信息验证成功，用户会被重定向回初始路径。在子组件中，你可以通过`this.props.location.state`获取state的信息。

```javascript
`<Redirect to={{pathname: '/login', state: {from: props.location}}}`
```

具体地，我们需要自定义路由来实现上面的场景

```javascript
class App5 extends React.Component {
    render(){
        return (
            <div className="app5">
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/category'>Category</Link>
                    </li>
                    <li>
                        <Link to='/products'>Products</Link>
                    </li>
                    <li>
                        <Link to='/admin'>Admin</Link>
                    </li>
                </ul>
                <Route exact path='/' component={Home} />
                <Route path='/category' component={Category} />
                <Route path='/products' component={Products} />
                <Route path='/login' component={Login} />

                {/*自定义路由*/}
                <PrivateRoute path='/admin' component={Admin} />
            </div>
        )
    }
}

const Home = props => <h2>This is Home {console.log('Home-Props')}{console.log(props)}</h2>

const Admin = () => <h2>Welcome to admin!</h2>


// 自定义路由
const PrivateRoute = (({component:Component,...rest}) => {
    return (
        <Route
            {...rest}
            render={props =>
                // 如果登录验证通过则进入Admin路由组件
                fakeAuth.isAuthenticated === true
                ?(<Component />)
                // 将from设置为Admin路由pathname，并传递给子组件Login
                :(<Redirect to={{pathname:'/login',state:{from:props.location.pathname}}} />)
            }
         />
    )
})
```

**Login组件**实现如下,主要就是通过```this.props.location.state.from```来记住是从哪个页面跳转过来的，然后如果```toAdmin```为```false```的话就要进行登录，登录后将```toAdmin```设为```true```，为```true```就是进行重定向跳转到原来的页面```<Redirect to={from} />```

```javascript
class Login extends React.Component {
    constructor(){
        super()
        this.state = {
            toAdmin:false
        }
    }

    login = () =>{
        fakeAuth.authenticate(() => {
            this.setState({
                toAdmin:true
            })
        })
    }

    render(){
        const from = this.props.location.state.from
        const toAdmin = this.state.toAdmin
        if(toAdmin) {
            return (
                <Redirect to={from} />
            )
        }
        return (
            <div className="login">
            {console.log(this.props)}
                <p>You must log in then go to the{from} </p>
                <button onClick={this.login}>
                    Log in
                </button>
            </div>
        )
    }
}

export default Login


export const fakeAuth = {
    // 验证状态
    isAuthenticated:false,
    authenticate(cb){
        this.isAuthenticated = true
        setTimeout(cb,100)
    }
}
```





