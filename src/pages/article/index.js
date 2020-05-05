import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import { actionCreators } from './store';
import './style.less';

const columnData = {
	author_name: '作者',
	avatar_url: '头像',
	create_at: '发布时间',
	visit_count: '访问量',
	title: '文章标题'
};

// 切换 pagesize 时页码也要对应上
class Article extends Component {
	formatData(list) {
		return list.map(item => ({
			key: Math.random() + '',
			author_name: item.author.loginname,
			avatar_url: item.author.avatar_url,
			create_at: item.create_at,
			visit_count: item.visit_count,
			title: item.title
		}));
	}
	formatColumn() {
		return Object.keys(columnData).map(item => {
			if (item === 'avatar_url') {
				return {
					title: columnData[item],
					dataIndex: item,
					key: item,
					render: function(avatarURL, record) {
						return (
							<img
								className="avatar"
								src={avatarURL}
								alt={record.author_name}
								title={record.author_name}
							/>
						);
					}
				};
			}
			return {
				title: columnData[item],
				dataIndex: item,
				key: item
			};
		});
	}
	componentDidMount() {
		this.props.getList(1, 10);
	}
	render() {
		const { list, isFetching, error } = this.props.article;
		if (error) {
			return <div>error</div>;
		} else {
			return (
				<Fragment>
					<Button onClick={this.props.jumptUser}>用户中心</Button>
					<Table
						columns={this.formatColumn()}
						dataSource={this.formatData(list)}
						loading={isFetching}
						pagination={{
							total: 100,
							defaultCurrent: 1,
							showSizeChanger: false,
							onChange: (page, pageSize) => {
								this.props.getList(page, pageSize);
							}
						}}
					/>
				</Fragment>
			);
		}
	}
}

const mapStateToProps = state => ({
	article: state.article
});

export default connect(mapStateToProps, actionCreators)(Article);
