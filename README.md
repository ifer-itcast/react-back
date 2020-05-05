# 一套后台管理初始化模板

## 创建项目

```
npx create-react-app react-back
```

## 集成 AntD

```
npm i antd
```

## 按需加载 AntD

```
npm i react-app-rewired customize-cra -D
npm i babel-plugin-import -D
```

```javascript
// package.json
{
    "scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-scripts eject"
    },
}
```

```javascript
// config-overrides.js
const { override, fixBabelImports } = require('customize-cra');

module.exports = override(
    fixBabelImports('antd', {
        libraryDirectory: 'es',
        style: 'css'
    })
);
```

## 自定义主题

注意安装 `less-loader@5` 这个版本，详见 [less-loader](https://github.com/ant-design/ant-design/issues/23624)

```
npm i less less-loader@5 -D
```

```javascript
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('antd', {
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: require('./theme')
    })
);
```

## i18n

AntD 默认文案是英文，需要 [国际化](https://ant.design/docs/react/i18n-cn)

src/index.js

```javascript
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>,
    document.getElementById('root')
);
```

## 路由设计

```
npm i react-router-dom
```

要考虑是否登录，以及登录后的 RBAC（基于角色的权限管理），默认路由跳转，无需登录路由（/login），需登录路由（/admin/xxx），最后的 404 处理。

src/index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Login from './pages/login';
import NotFound from './common/notfound';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Router>
            <Switch>
                {/* 1. 默认路由 */}
                <Redirect from="/" to="/admin" exact />
                {/* 2. 无需登录 */}
                <Route path="/login" component={Login} />
                {/* 3. 需要登录 */}
                <Route
                    path="/admin"
                    render={props => {
                        // 【登录状态监测】
                        return <App {...props} />;
                    }}
                />
                {/* 4. Not Found */}
                <Route component={NotFound} />
            </Switch>
        </Router>
    </ConfigProvider>,
    document.getElementById('root')
);
```

src/App.js

```javascript
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import User from './pages/user';
import Article from './pages/article';
import NotFound from './common/notfound';

export default class App extends Component {
    render() {
        return (
            <Switch>
                <Redirect from="/admin" to="/admin/user" exact />
                {/* 用 render 渲染方便后续做 RBAC 鉴权 */}
                <Route path="/admin/user" render={props => <User {...props} />} />
                <Route path="/admin/article" component={Article} />
                <Route component={NotFound} />
            </Switch>
        );
    }
}
```

## 基本界面

支持装饰器

```
npm i @babel/plugin-proposal-decorators -D
```

config-overrides.js

```javascript
const { addDecoratorsLegacy } = require('customize-cra');
module.exports = override( addDecoratorsLegacy() );
```

src/App.js

```javascript
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import NotFound from './common/notfound';

import User from './pages/user';
import Article from './pages/article';
import Setting from './pages/setting';

import Frame from './common/frame';

export default class App extends Component {
    getTitle = () => {
        switch (this.props.location.pathname) {
            case '/admin/user':
                return '用户中心';
            case '/admin/article':
                return '文章管理';
            case '/admin/setting':
                return '网站设置';
            default:
                return '圈子后台管理系统';
        }
    };
    componentDidMount() {
        document.title = this.getTitle();
    }
    componentDidUpdate() {
        document.title = this.getTitle();
    }
    render() {
        return (
            <Frame>
                <Switch>
                    <Redirect from="/admin" to="/admin/user" exact />
                    {/* 用 render 渲染方便后续做 RBAC 鉴权 */}
                    <Route path="/admin/user" render={props => <User {...props} />} />
                    <Route path="/admin/article" component={Article} />
                    <Route path="/admin/setting" component={Setting} />
                    <Route component={NotFound} />
                </Switch>
            </Frame>
        );
    }
}
```

## Axios 封装

```
npm i axios qs
```

下面对错误处理的封装可以根据具体场景搞得再详细点，`utils/http.js`

```javascript
import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';

// set NODE_ENV=development&&react-app-rewired start
axios.defaults.baseURL = [
    { type: 'development', url: 'https://cnodejs.org/api/v1' },
    { type: 'production', url: 'http://127.0.0.1:3000' }
].find(item => process.env.NODE_ENV === item.type).url;

axios.defaults.timeout = 10000; // Timeout
axios.defaults.withCredenttials = true; // Allow cookies across domains

// Configure according to server requirements
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = data => qs.stringify(data);

// Token save to redux or local
let hide = null;
axios.interceptors.request.use(
    config => {
        hide = message.loading('loading...');
        const token = localStorage.getItem('token');
        token && (config.headers.Authorization = token);
        return config;
    },
    error => Promise.reject(error)
);

axios.interceptors.response.use(
    res => {
        // Hide loading tips...
        hide && hide();
        return res.data;
    },
    error => {
        hide && hide();
        return Promise.reject(error)
    }
);

export default axios;
```

## Redux 配置

```
npm i redux react-redux redux-promise-middleware
```

src/store/index.js

```javascript
import { createStore, compose, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import reducer from './reducer';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(reducer, composeEnhancers(applyMiddleware(promise)));
```

src/store/reducer.js

```javascript
import { combineReducers } from 'redux';
import { reducer as articleReducer } from '../pages/article/store';
export default combineReducers({
    article: articleReducer
});
```

src/pages/article/store/index.js

```javascript
import * as actionTypes from './actionTypes';
import actionCreators from './actionCreators';
import reducer from './reducer';

export { reducer, actionCreators, actionTypes };
```

## connected-react-router

```
npm i connected-react-router
```

Step1: src/store/reducer.js

```javascript
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as articleReducer } from '../pages/article/store';
import history from '../utils/history';

export default combineReducers({
    router: connectRouter(history),
    article: articleReducer
});
```

Step2: src/store/index.js

```javascript
import { createStore, compose, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import reducer from './reducer';
import history from '../utils/history';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(reducer, composeEnhancers(applyMiddleware(history, promise)));
```

Step3: src/index.js

```javascript
import { ConnectedRouter } from 'connected-react-router';
import Login from './pages/login';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Router>
                    <Switch>
                        
                    </Switch>
                </Router>
            </ConnectedRouter>
        </Provider>
    </ConfigProvider>,
    document.getElementById('root')
);
```

Step4: 使用

actionCreator.js

```javascript
import { push } from 'connected-react-router';
export default {
	jumptUser: () => push('/admin/user')
};
```

## react-loadable

```javascript
// 路由懒加载
npm i react-loadable
```