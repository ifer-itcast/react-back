import Loadable from 'react-loadable';
import { Spin } from 'antd'

const Frame = Loadable({
	loader: () => import('./frame'),
	loading: Spin
});
const NotFound = Loadable({
	loader: () => import('./notfound'),
	loading: Spin
});
export { Frame, NotFound };
