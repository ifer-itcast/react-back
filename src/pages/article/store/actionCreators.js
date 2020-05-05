import axios from '../../../utils/http';
import * as actionTypes from './actionTypes';

export const getList = (page, size) => ({
	type: actionTypes.GET_LIST,
	payload: {
		promise: axios.get(`/topics?page=${page}&limit=${size}`)
	}
});
