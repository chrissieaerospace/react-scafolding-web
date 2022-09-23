import { newObject } from 'react-boilerplate-redux-saga-hoc/utils';
import {
  HOC_INITIAL_CONFIG_KEY,
  commonConstants,
} from 'react-boilerplate-redux-saga-hoc/constants';

import * as ALL_END_POINTS_CONFIG from './apiEndPoints';
import { HOC } from '../config';
import axios from '../axios';

export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT } = commonConstants;
export const AUTHENTICATION_REDUCER_NAME = 'Authentication';

const { DONT_RESET_ON_LOGOUT_API_KEYS } = ALL_END_POINTS_CONFIG;
const API_END_POINTS_CONFIG = newObject(ALL_END_POINTS_CONFIG);
delete API_END_POINTS_CONFIG.DONT_RESET_ON_LOGOUT_API;

const constantReducer = ({
  type,
  state,
  // action,
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
  [DONT_RESET_REDUCER_KEYS]: DONT_RESET_ON_LOGOUT_API_KEYS,
  [REDUCER_NAME]: AUTHENTICATION_REDUCER_NAME,
  [AXIOS_INTERCEPTORS]: axios,
  [REDUCER]: undefined,
});

export { useAuthenticationHoc };

/* Important Please don't remove below code for reference 
  const reducer = ({
    constants,
    successData,
    restSuccessData,
    payload,
    query,
    state,
    params,
    restPayload,
    loadingStatus,
    statusCode,
    type,
    newState,
    method,
    reset,
    statusMessage,
    errorData,
    restErrorData,
    resetState,
    initialState,
    commonHandler,
    commmonErrorHandler,
    defaultReducerHandler,
  }) => {
    switch (type) {
      case constants.GET_USER_PROFILE_API[CALL]:
        switch (method) {
          case ON_SUCCESS:
            return newState(({ [type]: Data }) => ({
              profile: successData,
              isLoggedIn: !!(
                successData.member &&
                successData.member.id &&
                successData.member['verification-status']
              ),
              [type]: newObject(Data, commonHandler()),
            }));
          default:
            return defaultReducerHandler(); // for handling others such as Error
        }
      case constants.LOGOUT_API[CALL]:
        switch (method) {
          case ON_SUCCESS:
            return { ...resetState, ...initialState };
          default:
            return defaultReducerHandler(); // for handling others such as Error
        }
      default:
        return defaultReducerHandler();
    }
  };
 */
