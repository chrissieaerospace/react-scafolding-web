import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';

/**
 * Merges the main reducer with the current state and dynamically injected reducers
 */

/* use this for adding new reducer */
export default function createReducer(injectedReducers = {}) {
  // console.log(injectedReducers);
  const rootReducer = combineReducers(injectedReducers);
  return enableBatching(rootReducer);
}
