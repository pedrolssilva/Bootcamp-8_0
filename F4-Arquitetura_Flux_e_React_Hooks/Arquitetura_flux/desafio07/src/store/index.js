import { createStore } from 'redux';

import rootReducer from './modules/rootReducer';

const enhancer = __DEV__ ? console.tron.createEnhancer() : undefined;

const store = createStore(rootReducer, enhancer);

export default store;
