/* eslint-disable no-unused-vars */
import {
  commonConstants,
  // store,
} from 'react-boilerplate-redux-saga-hoc';
import { HOC_INITIAL_CONFIG_KEY } from 'react-boilerplate-redux-saga-hoc/utils';

import * as ALL_API_END_POINTS from './apiEndPoints';
import { HOC } from '../config';
import axios from '../axios';

export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT } = commonConstants;
export const AUTHENTICATION_REDUCER_NAME = 'Authentication';

// eslint-disable-next-line prefer-object-spread
const API_END_POINTS_CONFIG = Object.assign({}, ALL_API_END_POINTS);
delete API_END_POINTS_CONFIG.dontResetOnLogout;

const constantReducer = ({
  type,
  state,
  action,
  // constants,
  initialState,
  resetState,
}) => {
  switch (type) {
    case 'LOGOUT':
      return { ...resetState, ...initialState };
    default:
      return state;
  }
};

const {
  INITIAL_STATE,
  REDUCER,
  REDUCER_CONSTANT,
  REDUCER_NAME,
  API_END_POINTS,
  DONT_RESET_REDUCER_KEYS,
  AXIOS_INTERCEPTORS,
} = HOC_INITIAL_CONFIG_KEY;

const useAuthenticationHoc = HOC({
  [INITIAL_STATE]: {
    isLoggedIn: false,
    profile: {},
  },
  [REDUCER_CONSTANT]: constantReducer,
  [API_END_POINTS]: API_END_POINTS_CONFIG,
  [DONT_RESET_REDUCER_KEYS]: ALL_API_END_POINTS.dontResetOnLogout,
  [REDUCER_NAME]: AUTHENTICATION_REDUCER_NAME,
  [AXIOS_INTERCEPTORS]: axios,
  // [REDUCER]: reducer,
});

export { useAuthenticationHoc };

// const reducer = ({
//   constants,
//   successData,
//   restSuccessData,
//   payload,
//   query,
//   state,
//   params,
//   restPayload,
//   loadingStatus,
//   statusCode,
//   type,
//   newState,
//   method,
//   reset,
//   statusMessage,
//   errorData,
//   restErrorData,
//   resetState,
//   initialState,
//   commonHandler,
//   commmonErrorHandler,
//   defaultReducerHandler,
// }) => {
//   switch (type) {
//     case constants.GET_USER_PROFILE_API[CALL]:
//       switch (method) {
//         case ON_SUCCESS:
//           return newState(({ [type]: Data }) => ({
//             profile: successData,
//             isLoggedIn: !!(
//               successData.member &&
//               successData.member.id &&
//               successData.member['verification-status']
//             ),
//             [type]: newObject(Data, commonHandler()),
//           }));
//         default:
//           return defaultReducerHandler(); // for handling others such as Error
//       }
//     case constants.LOGOUT_API[CALL]:
//       switch (method) {
//         case ON_SUCCESS:
//           return { ...resetState, ...initialState };
//         default:
//           return defaultReducerHandler(); // for handling others such as Error
//       }
//     default:
//       return defaultReducerHandler();
//   }
// };
