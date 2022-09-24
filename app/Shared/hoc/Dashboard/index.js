import { newObject } from 'react-boilerplate-redux-saga-hoc/utils';
import {
  HOC_INITIAL_CONFIG_KEY,
  commonConstants,
} from 'react-boilerplate-redux-saga-hoc/constants';

import * as ALL_END_POINTS_CONFIG from './apiEndPoints';
import axios from '../axios';
import { HOC } from '../config';

export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT } = commonConstants;
export const DASHBOARD_REDUCER_NAME = 'Dashboard';

const { DONT_RESET_ON_LOGOUT_API_KEYS } = ALL_END_POINTS_CONFIG;
const API_END_POINTS_CONFIG = newObject(ALL_END_POINTS_CONFIG);
delete API_END_POINTS_CONFIG.DONT_RESET_ON_LOGOUT_API_KEYS;

const {
  INITIAL_STATE,
  REDUCER,
  REDUCER_CONSTANT,
  REDUCER_NAME,
  API_END_POINTS,
  DONT_RESET_REDUCER_KEYS,
  AXIOS_INTERCEPTORS,
} = HOC_INITIAL_CONFIG_KEY;

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

const useDashboardHoc = HOC({
  [INITIAL_STATE]: {},
  [REDUCER]: reducer,
  [REDUCER_CONSTANT]: constantReducer,
  [API_END_POINTS]: API_END_POINTS_CONFIG,
  [DONT_RESET_REDUCER_KEYS]: DONT_RESET_ON_LOGOUT_API_KEYS,
  [REDUCER_NAME]: DASHBOARD_REDUCER_NAME,
  [AXIOS_INTERCEPTORS]: axios,
});

export { useDashboardHoc };
