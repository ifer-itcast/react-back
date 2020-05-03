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
