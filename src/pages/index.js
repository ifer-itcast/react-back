import Loadable from 'react-loadable';
import { Spin } from 'antd';

const Article = Loadable({
	loader: () => import('./article'),
	loading: Spin
});
const Login = Loadable({
	loader: () => import('./login'),
	loading: Spin
});
const Setting = Loadable({
	loader: () => import('./setting'),
	loading: Spin
});
const User = Loadable({
	loader: () => import('./user'),
	loading: Spin
});

export { Article, Login, Setting, User };
