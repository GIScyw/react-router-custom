#                   React Router Redux

React Router Redux前身为**Redux Simple Router**，我们知道React Router已经很强大了，但为什么还需要React Router Redux呢?对于前端应用来说，**路由状态也是应用状态的一部分**。在很多情况下，我们的业务逻辑与路由状态有很强的关联关系。比如，最常见的一个列表页中，分页参数、排序参数可能都会在路由中体现，而这些参数的改变必然导致列表中的数据发生变化。因此，**当我们采用Redux架构时，所有的应用状态必须放在一个单一的store中管理，路由状态也不例外**。而这就是React Router Redux为我们实现的主要功能———**将应用的路由信息与redux中的store绑定在一起**。

1.将React Router与Redux store绑定

React Router Redux提供的API---**syncHistoryWithStore来完成与Redux store的绑定工作**。我们只需传入history(browserHistory,hashHistory或者自己创建的history)，以及Redux中的store，就可以获得一个**增强后的history对象**。

将这个history对象传给React Router中的<Router>组件作为props，就给React Router Redux提供了观察路由变化并改变store的能力(反之亦然)

```
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import reducers from '<project-path>/reducers'

const store=createStore(reducers);
const history=syncHistoryWithStore(browserHistory,store);
```

2.用Redux的方式改变路由

要改变数据，必须要分发一个action，**在Redux应用中需要改变路由时，也要分发一个action**。但在这之前，我们需要**对Redux中的store进行一些增强，以便分发的action能被正确识别**

```
import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'

const middleware=routerMiddleware(browserHistory);
const store=createStore(
  reducers,
  applyMiddleware(middleware)
);
```

routerMiddleware实际上是一个**middleware工厂**，传入history对象，返回一个真正的Redux middleware，将其作为第二个参数传入ceateStore方法，获得被React Router Redux加工过的心store。最后，就可以**用store.dispatch来分发一个路由变动的action**了。

```
import {push} form 'react-router-redux';

store.dispatch(push('/home'));
```







