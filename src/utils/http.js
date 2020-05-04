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
