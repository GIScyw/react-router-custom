React Router v4几乎重写了v2/v3，相比于v3变化较大，包括Router/Route的改变，组件嵌套的方式，路由的生命周期，Swicth和Redirect等组件都改变较多，新版本的react router更偏向组件化，基本上与React的思想一致。

### Router

在v3中，我们使用带history属性的```Router```

```javascript
// v3
import routes from './routes'
<Router history={browserHistory} routes={routes} />
// or
<Router history={browserHistory}>
  <Route path='/' component={App}>
    // ...
  </Route>
</Router>
```

在v4中,提供了几种不同的Router组件，每个Router组件都会创建一个```history```对象。

```javascript
//v4
<BrowserRouter>
  <div>
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
  </div>
</BrowserRouter>
```

在v3中Router组件里面可以渲染多个组件

```javascript
// V2 or V3
import { Router, Route, hashHistory } from 'react-router';

<Router history={hashHistory}>
  <Route path='/about' component={About} />
  <Route path='/contact' component={Contact} />
</Router>
```

而v4中，Router组件只能渲染一个组件

```javascript
// yes
<BrowserRouter>
  <div>
    <Route path='/about' component={About} />
    <Route path='/contact' component={Contact} />
  </div>
</BrowserRouter>

// no
<BrowserRouter>
  <Route path='/about' component={About} />
  <Route path='/contact' component={Contact} />
</BrowserRouter>
```

### Routes

在v3中，<Route>并不是一个组件，所有的<Route>只是创建一个route配置对象

```javascript
/// in v3 the element
<Route path='contact' component={Contact} />
// was equivalent to
{
  path: 'contact',
  component: Contact
}
```

在v4中，<Route>组件就是一个真正的组件，当```path```与当前```location```匹配时，就会使用```rendering prop（component，render或者children）```来渲染；当```path```没有匹配到时，就会渲染null。

### 嵌套路由

在v3中，<Route>的嵌套通过将它们作为父<Route>的children

```javascript
<Route path="parent" component={Parent}>
  <Route path="child" component={Child} />
  <Route path="other" component={Other} />
</Route>
```

在v4中，<Route>只能被它的父<Route>组件渲染

```javascript
<Route path="parent" component={Parent} />;

function Parent() {
  return (
    <div>
      <Route path="child" component={Child} />
      <Route path="other" component={Other} />
    </div>
  );
}
```

### 路由的生命周期)

V3提供了```onEnter```，```onUpdate```和```onLeaves```方法，在v4中我们需要用生命周期方法，用```componentDidMount```代替```onEnter```,用```componentDidupdate```代替```onUpdate```,用```componentWillUnmount```代替```onLeave```。

### Switch

在v3中，我们可以指定多个子routes，只有第一个匹配的才会渲染

```javascript
// v3
<Route path="/" component={App}>
  <IndexRoute component={Home} />
  <Route path="about" component={About} />
  <Route path="contact" component={Contact} />
</Route>
```

v4提供了<Switch>组件，当一个<Swicth>组件被渲染时,只有匹配当前location的第一个child <Route>才会被渲染。

```javascript
// v4
const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/contact" component={Contact} />
  </Switch>
);
```

### Redirect

在v3中，如果我们需要进行路径的跳转，比如从``` /``` 跳转到``` /welcome```，就需要用到``` IndexRedirect```。

```javascript
// v3
<Route path="/" component={App}>
  <IndexRedirect to="/welcome" />
</Route>
```

在V4中，我们可以使用 ```Redirect```

```javascript
// v4
<Route exact path="/" render={() => <Redirect to="/welcome" component={App} />} />

<Switch>
  <Route exact path="/" component={App} />
  <Route path="/login" component={Login} />
  <Redirect path="*" to="/" />
</Switch>
```

在v3中，```Redirect```保留了查询字符串

```javascript
// v3

<Redirect from="/" to="/welcome" />
// /?source=google → /welcome?source=google
```

在v4中，我们需要重新传递这些属性到 to属性上

```javascript
// v4

<Redirect from="/" to="/welcome" />
// /?source=google → /welcome

<Redirect from="/" to={{ ...location, pathname: "/welcome" }} />
// /?source=google → /welcome?source=google
```

### 其他变化

#### history.push和history.replace

```javascript
/ V2 or V3
history.push({
    pathname: '/home',
    query: {
        foo: 'test',
bar: 'temp'
    }
});
history.replace({
    pathname: '/home',
    query: {
        foo: 'test',
bar: 'temp'
    }
});


// V4
history.push({
    pathname: '/home',
    search: '?foo=test&bar=temp',
});
history.replace({
    pathname: '/home',
    search: '?foo=test&bar=temp',
});

```

#### 可选参数

在v3中通过括号来表示可选   ```path="/entity/:entityId(/:parentId)"```

在v4中通过一个尾随的问号来表示可选   ```path="/entity/:entityId/:parentId?"```

#### props.params

```javascript
// V2 or V3 获取params可以这么获取
this.props.params
```

```javascript
// V4
this.props.match.params
```

#### location.query(查询字符串)

 V4 去掉了```location.query```，只能使用```search```来获取，为了让其跟浏览器一样，如果想要兼容以前的```location.query```，可以使用```query-string```库解析一下

```javascript
// V2 or V3 获取query可以这么获取
this.props.location.query
```

```javascript
// V4 去掉了location.query，只能使用search来获取，为了让其跟浏览器一样
// 如果想要兼容以前的location.query，可以使用query-string库解析一下
// 如: queryString.parse(props.location.search)
this.props.location.search
```

#### location.action

```javascript
// V2 or V3 获取location的action
this.props.location.action
```

```javascript
// V4 去掉了location.action, 放在了history里面
history.action
```

#### 获取history库

```javascript
//以前获取react-router里面的history库，可以这么获取:

import {hashHistory as history} from 'react-router';
```

```javascript
//V4

import createHashHistory as history from 'history/createHashHistory';
```





**参考文章：**

[Migrating from v2/v3 to v4](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md#on-properties)

[ReactRouter升级 v2 to v4](https://www.cnblogs.com/libin-1/p/7067938.html)

