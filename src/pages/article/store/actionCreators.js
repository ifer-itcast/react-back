import { push } from 'connected-react-router';
import axios from '../../../utils/http';
import * as actionTypes from './actionTypes';

export default {
	getList: (page, size) => ({
		type: actionTypes.GET_LIST,
		payload: {
			promise: axios.get(`/topics?page=${page}&limit=${size}`)
		}
	}),
	jumptUser: () => push('/admin/user')
};
