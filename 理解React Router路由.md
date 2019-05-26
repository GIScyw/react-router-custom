**React Router**系列分为三个部分，**React Router基础内容**，**React Router从V2/V3到V4的变化**，**React Router实现原理**。

> 下面未说明的都指的是React Router V4，用到的包是```react-router-dom```

###  React Router的特性

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

![1](D:\github目录\react-router\image\1.png)

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

````javascript
...
import {HashRouter, Route, Switch, hashHistory} from 'react-router-dom';
...
<HashRouter history={hashHistory}>
...
````

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

>对于大型应用来说，一个首当其冲的问题就是所需加载的JavaScript的大小。程序应当只加载当前渲染页所需的JavaScript。有些开发者将这种方式称之为“代码分拆” —— 将所有的代码分拆成多个小包，在用户浏览过程中按需加载。React-Router 里的路径匹配以及组件加载都是异步完成的，不仅允许你延迟加载组件，并且可以延迟加载路由配置。Route可以定义 getChildRoutes，getIndexRoute 和 getComponents 这几个函数。它们都是异步执行，并且只有在需要时才被调用。我们将这种方式称之为 “逐渐匹配”。 React-Router 会逐渐的匹配 URL 并只加载该URL对应页面所需的路径配置和组件。

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



















### React Router的依赖基础history

#### 1.基础概念

history是一个独立的第三方js库，可以用来兼容在不同浏览器、不同环境下对历史记录的管理。主要包括三类，

- 老版本的history：通过hash来实现，对应createHashHistory
- 高版本的history：通过HTML5里面的history,对应createBrowserHistory
- node环境下：主要存储在memory里面，对应creatememoryHistory

上面针对不同的环境提供了三个API，但三个API有一些共性的操作，将其抽象了一个公共的文件createHistory：

```javascript
// 内部的抽象实现
function createHistory(options={}) {
  ...
  return {
    listenBefore, // 内部的hook机制，可以在location发生变化前执行某些行为，AOP的实现
    listen, // location发生改变时触发回调
    transitionTo, // 执行location的改变
    push, // 改变location
    replace,
    go,
    goBack,
    goForward,
    createKey, // 创建location的key，用于唯一标示该location，是随机生成的
    createPath,
    createHref,
    createLocation, // 创建location
  }
}
```

其中需要注意的是，此时的location跟浏览器中原生的location是不相同的，最大的区别就在于里面多了key字段，history内部是通过key来进行location的操作。

```javascript
function createLocation() {
  return {
    pathname, // url的基本路径
    search, // 查询字段
    hash, // url中的hash值
    state, // url对应的state字段
    action, // 分为 push、replace、pop三种
    key // 生成方法为: Math.random().toString(36).substr(2, length)
  }
}
```

#### 2.内部解析

三个API的大致的技术实现如下:

- `createBrowserHistory`: 利用HTML5里面的history
- `createHashHistory`: 通过hash来存储在不同状态下的history信息
- `createMemoryHistory`: 在内存中进行历史记录的存储

##### 2.1 执行url前进：

- `createBrowserHistory`: pushState、replaceState
- `createHashHistory`: `location.hash=***` `location.replace()`
- `createMemoryHistory`: 在内存中进行历史记录的存储

伪代码实现如下:

```javascript
// createBrowserHistory(HTML5)中的前进实现
function finishTransition(location) {
  ...
  const historyState = { key };
  ...
  if (location.action === 'PUSH') ) {
    window.history.pushState(historyState, null, path);
  } else {
    window.history.replaceState(historyState, null, path)
  }
}
// createHashHistory的内部实现
function finishTransition(location) {
  ...
  if (location.action === 'PUSH') ) {
    window.location.hash = path;
  } else {
    window.location.replace(
    window.location.pathname + window.location.search + '#' + path
  );
  }
}
// createMemoryHistory的内部实现
entries = [];
function finishTransition(location) {
  ...
  switch (location.action) {
    case 'PUSH':
      entries.push(location);
      break;
    case 'REPLACE':
      entries[current] = location;
      break;
  }
}
```

##### 2.2 检测url回退：

- `createBrowserHistory`: `popstate`
- `createHashHistory`: `hashchange`
- `createMemoryHistory`: 因为是在内存中操作，跟浏览器没有关系，不涉及UI层面的事情，所以可以直接进行历史信息的回退

伪代码实现如下:

```javascript
// createBrowserHistory(HTML5)中的后退检测
function startPopStateListener({ transitionTo }) {
  function popStateListener(event) {
    ...
    transitionTo( getCurrentLocation(event.state) );
  }
  addEventListener(window, 'popstate', popStateListener);
  ...
}
 
// createHashHistory的后退检测
function startPopStateListener({ transitionTo }) {
  function hashChangeListener(event) {
    ...
    transitionTo( getCurrentLocation(event.state) );
  }
  addEventListener(window, 'hashchange', hashChangeListener);
  ...
}
// createMemoryHistory的内部实现
function go(n) {
  if (n) {
    ...
    current += n;
  const currentLocation = getCurrentLocation();
  // change action to POP
  history.transitionTo({ ...currentLocation, action: POP });
  }
}
```

##### 2.3 存储state

将state存储在sessionStorage里面

```javascript
// createBrowserHistory/createHashHistory中state的存储
function saveState(key, state) {
  ...
  window.sessionStorage.setItem(createKey(key), JSON.stringify(state));
}
function readState(key) {
  ...
  json = window.sessionStorage.getItem(createKey(key));
  return JSON.parse(json);
}
// createMemoryHistory仅仅在内存中，所以操作比较简单
const storage = createStateStorage(entries); // storage = {entry.key: entry.state}
 
function saveState(key, state) {
  storage[key] = state
}
function readState(key) {
  return storage[key]
}
```

从上面三个例子可以看出，三种api的实现方式是不一样的，具体的细节可以看源码。

### React—Router的原理

React-Router是在history库基础上实现的。

![0e753ac7e440fca9cb1cd7995ce26ef0_b](D:\github目录\react-router\image\0e753ac7e440fca9cb1cd7995ce26ef0_b.png)

#### 点击Link标签路由系统发生的变化

1. Link组件最终会被渲染成HTML标签<a>,它的to,query,hash属性会被组合在一起并渲染为href属性

2. 然后调用window.location.hash或者window.history.putState()修改了应用的url,这取决于history对象的方式。同时会触发history.listen中注册的事件监听器。history包中底层的putState方法支持传入两个参数state和path，在函数体内有将这两个参数传输到createLocation方法中，返回location的结构如下：

   ```javascript
   location = {
     pathname, // 当前路径，即 Link 中的 to 属性
     search, // search
     hash, // hash
     state, // state 对象
     action, // location 类型，在点击 Link 时为 PUSH，浏览器前进后退时为 POP，调用 replaceState 方法时为 REPLACE
     key, // 用于操作 sessionStorage 存取 state 对象
   };
   ```

3. 将上述location对象作为参数传入到Transition方法中，得到新的location对象

4. 接下来就是系统修改UI了

5. 在得到新的location对象后，系统内部的matchRoutes方法会匹配出Route组件树中与与当前location对象匹配的一个子集，并且得到了nextState

   ```javascript
   nextState = {
     location, // 当前的 location 对象
     routes, // 与 location 对象匹配的 Route 树的子集，是一个数组
     params, // 传入的 param，即 URL 中的参数
     components, // routes 中每个元素对应的组件，同样是数组
   };
   ```

6. 在Router组件的componentWillMount生命周期方法中调用了history.listen(listener)方法；listener会在上述matchRoutes方法执行成功后执行listener(nextState),接下来执行this.setState(nextState)就可以实现重新渲染Router组件。


#### 点击前进或后退发生的变化

可以简单把浏览器的历史记录比作成一个仅有入栈操作的栈，当用户浏览到某一个页面时将该文档存入到栈中，点击后退或前进按钮时移动指针到history栈中对应的某一个文档。

location.hash与hashChange事件

- 使用hashChange事件来监听window.location.hash的变化，路由系统会将所有的路由信息都保存到location.hash中
- hash变化时浏览器会更新url，并且在history栈中产生一条记录
- window.addListener('hashChange',listen,false)事件监听器可以通过hash fragment获取当前url对应的location对象
- 接下来的过程与点击Link组件时一致

history.putState与popState事件

- 在浏览器前进或者后退时触发popstate事件，然后注册window.addEventListener('popstate'，listener，false)，并且可以在事件对象中取出对应的state对象

- state对象可以存储一些恢复该页面所需要的简单信息，上文已经提到state会作为属性存储在location对象中，我们可以通过location.state来获取

- 在react-router内部将该对象存储到sessionStorage中，即saveState操作

- 接下来与上述第一种方式一致



  **参考文章：**

  [深入理解React-Router路由原理](https://www.cnblogs.com/wyaocn/p/5805777.html)

  [React Router中文文档](https://react-guide.github.io/react-router-cn/index.html)

  [React Router英文文档](https://reacttraining.com/react-router/core/guides/philosophy)

  [React Router API介绍](https://segmentfault.com/a/1190000014294604)

  [React Router V4版本 完全指北](http://web.jobbole.com/92873/)

  [React保护式路由](https://www.jianshu.com/p/2d75a8460879)