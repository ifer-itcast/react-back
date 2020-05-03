import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Login from './pages/login';
import NotFound from './common/notfound';

import './index.less';

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
