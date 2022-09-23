import { combineReducers } from 'redux';
import { enableBatching } from 'redux-batched-actions';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */

// use this for adding new reducer
// //   const reducer =
// //     Object.keys(injectedReducers).length > 0
// //       ? injectedReducers
// //       : {
// //           global: () => ({}),
// //         };
export default function createReducer(injectedReducers = {}) {
  //   console.log(injectedReducers);
  const rootReducer = combineReducers(injectedReducers);
  return enableBatching(rootReducer);
}
