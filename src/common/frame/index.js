import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, HighlightOutlined, SettingOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
const { Header, Content, Sider } = Layout;

@withRouter
class Frame extends Component {
	handleClick = ({ key }) => {
		this.props.history.push(key);
	};
	render() {
		const { location } = this.props;
		return (
			<Layout style={{ minHeight: '100%' }}>
				<Header className="header">
					<div style={{ color: '#fff' }}>圈子后台管理系统</div>
				</Header>
				<Layout>
					<Sider width={200} className="site-layout-background">
						<Menu
							mode="inline"
							selectedKeys={[location.pathname]}
							style={{ height: '100%', borderRight: 0 }}
							onClick={this.handleClick}
						>
							<Menu.Item key="/admin/user" icon={<UserOutlined />}>
								用户中心
							</Menu.Item>
							<Menu.Item key="/admin/article" icon={<HighlightOutlined />}>
								文章管理
							</Menu.Item>
							<Menu.Item key="/admin/setting" icon={<SettingOutlined />}>
								网站设置
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout style={{ padding: '0 24px 24px' }}>
						<Content
							className="site-layout-background"
							style={{
								padding: 24,
								margin: 0,
								marginTop: 24,
								minHeight: 280,
								backgroundColor: '#fff'
							}}
						>
							{this.props.children}
						</Content>
					</Layout>
				</Layout>
			</Layout>
		);
	}
}
export default Frame;
