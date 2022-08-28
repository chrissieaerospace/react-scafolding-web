import {
  HOC as HocConfigure,
  commonConstants,
  // store,
} from 'react-boilerplate-redux-saga-hoc';
import * as ALL_API_END_POINTS from './apiEndPoints';
import axios from '../axios';
export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT } = commonConstants;
export const DASHBOARD_REDUCER_NAME = 'Dashboard';
// eslint-disable-next-line prefer-object-spread
const API_END_POINTS = Object.assign({}, ALL_API_END_POINTS);
delete API_END_POINTS.dontResetOnLogout;

const reducer = ({ type, defaultReducerHandler }) => {
  switch (type) {
    default:
      return defaultReducerHandler();
  }
};
const constantReducer = ({
  type,
  state,
  // action,
  // constants,
  // initialState,
  // resetState,
}) => {
  switch (type) {
    // case 'LOGOUT':
    //   return { ...resetState, ...initialState };
    default:
      return state;
  }
};

const HOC = HocConfigure({
  handlers: [],
  useHocHook: true,
});

const useDashboardHoc = HOC({
  initialState: {
    isLoggedIn: false,
  },
  // dontReset: {},
  reducer,
  constantReducer,
  apiEndPoints: API_END_POINTS,
  dontReset: ALL_API_END_POINTS.dontResetOnLogout,
  name: DASHBOARD_REDUCER_NAME,
  axiosInterceptors: axios,
});

export { useDashboardHoc };
