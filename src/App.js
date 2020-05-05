import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Frame, NotFound } from './common';
import { User, Article, Setting } from './pages';

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
