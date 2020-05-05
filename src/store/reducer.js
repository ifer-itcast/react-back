import { combineReducers } from 'redux';
import { reducer as articleReducer } from '../pages/article/store';
export default combineReducers({
	article: articleReducer
});
