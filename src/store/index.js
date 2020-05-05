import { createStore, compose, applyMiddleware } from 'redux';
import promise from 'redux-promise-middleware';
import { routerMiddleware } from 'connected-react-router';
import reducer from './reducer';
import history from '../utils/history';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(reducer, composeEnhancers(applyMiddleware(routerMiddleware(history), promise)));
