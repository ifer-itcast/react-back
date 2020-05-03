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