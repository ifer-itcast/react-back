import * as actionTypes from './actionTypes';
const defaultState = {
	list: [],
	isFetching: false,
	error: null
};
export default (state = defaultState, action) => {
	switch (action.type) {
		case actionTypes.GET_LIST_PENDING:
			return {
				isFetching: true,
				error: null,
				list: []
			};
		case actionTypes.GET_LIST_FULFILLED:
			return {
				isFetching: false,
				error: null,
				list: [...state.list, ...action.payload.data]
			};
		case actionTypes.GET_LIST_REJECTED:
			return {
				isFetching: false,
				error: action.error,
				list: []
			};
		default:
			return state;
	}
};
