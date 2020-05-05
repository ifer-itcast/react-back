import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as articleReducer } from '../pages/article/store';
import history from '../utils/history';

export default combineReducers({
	router: connectRouter(history),
	article: articleReducer
});
