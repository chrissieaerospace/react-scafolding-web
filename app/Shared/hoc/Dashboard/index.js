import {
  HOC_INITIAL_CONFIG_KEY,
  commonConstants,
} from 'react-boilerplate-redux-saga-hoc/constants';
import * as ALL_API_END_POINTS from './apiEndPoints';
import axios from '../axios';
import { HOC } from '../config';

export const { CALL, ON_SUCCESS, ON_ERROR, ON_UNMOUNT } = commonConstants;
export const DASHBOARD_REDUCER_NAME = 'Dashboard';

// eslint-disable-next-line prefer-object-spread
const API_END_POINTS_CONFIG = Object.assign({}, ALL_API_END_POINTS);
delete API_END_POINTS_CONFIG.dontResetOnLogout;

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
  [INITIAL_STATE]: {
    activeEvent: {},
    eventToView: {},
    showTeamProfile: false,
    teamToView: {},
    showGamerProfile: false,
    gamerToView: {},
    chatModalView: null,
    eventToRegister: {},
    showRegisterModal: false,
  },
  [REDUCER]: reducer,
  [REDUCER_CONSTANT]: constantReducer,
  [API_END_POINTS]: API_END_POINTS_CONFIG,
  [DONT_RESET_REDUCER_KEYS]: ALL_API_END_POINTS.dontResetOnLogout,
  [REDUCER_NAME]: DASHBOARD_REDUCER_NAME,
  [AXIOS_INTERCEPTORS]: axios,
});

export { useDashboardHoc };
