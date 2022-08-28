/* eslint-disable no-unused-vars */
import {
  HOC as HocConfigure,
  commonConstants,
  // store,
} from 'react-boilerplate-redux-saga-hoc';
import * as ALL_API_END_POINTS from './apiEndPoints';
import axios from '../axios';
export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT } = commonConstants;
export const AUTHENTICATION_REDUCER_NAME = 'Authentication';
// eslint-disable-next-line prefer-object-spread
const API_END_POINTS = Object.assign({}, ALL_API_END_POINTS);
delete API_END_POINTS.dontResetOnLogout;

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
    // case constants.GET_USER_PROFILE_API[CALL]:
    //   switch (method) {
    //     case ON_SUCCESS:
    //       return newState(({ [type]: Data }) => ({
    //         profile: successData,
    //         isLoggedIn: !!(
    //           successData.member &&
    //           successData.member.id &&
    //           successData.member['verification-status']
    //         ),
    //         [type]: newObject(Data, commonHandler()),
    //       }));
    //     default:
    //       return defaultReducerHandler(); // for handling others such as Error
    //   }
    // case constants.LOGOUT_API[CALL]:
    //   switch (method) {
    //     case ON_SUCCESS:
    //       return { ...resetState, ...initialState };
    //     default:
    //       return defaultReducerHandler(); // for handling others such as Error
    //   }
    default:
      return defaultReducerHandler();
  }
};
const HOC = HocConfigure({
  handlers: [],
  useHocHook: true,
});
const useAuthenticationHoc = HOC({
  initialState: {
    isLoggedIn: false,
  },
  // dontReset: {},
  reducer,
  constantReducer: ({
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
  },
  apiEndPoints: API_END_POINTS,
  dontReset: ALL_API_END_POINTS.dontResetOnLogout,
  name: AUTHENTICATION_REDUCER_NAME,
  axiosInterceptors: axios,
});

export { useAuthenticationHoc };
