import { API_END_POINTS_CONFIG_KEYS } from 'react-boilerplate-redux-saga-hoc/utils';
import { AUTH_BASE_URL } from '../../utils/config';

// const API_BASE_URL = `${BASE_URL}/api/v1/`;
const API_AUTH_BASE_URL = `${AUTH_BASE_URL}/api`;

const {
  API_URL,
  // AXIOS_INTERCEPTORS,
  API_METHOD,
  API_RESPONSE_SUCCESS_STATUS_CODE_KEY,
  API_RESPONSE_SUCCESS_STATUS_CODES,
  API_RESPONSE_SUCCESS_MESSAGE_KEY,
  API_RESPONSE_SUCCESS_DATA_KEY,
  API_RESPONSE_ERROR_DATA_KEY,
  API_RESPONSE_ERROR_STATUS_CODE_KEY,
  API_RESPONSE_ERROR_MESSAGE_KEY,
  API_ERROR_HANDLER_STATUS_CODES,
} = API_END_POINTS_CONFIG_KEYS;

// eslint-disable-next-line no-unused-vars
const COMMON_REQUEST_RESPONSE_KEYS = {
  /** Success Reponse handling */
  [API_RESPONSE_SUCCESS_STATUS_CODE_KEY]: 'code',
  [API_RESPONSE_SUCCESS_STATUS_CODES]: [900, 910],
  [API_RESPONSE_SUCCESS_MESSAGE_KEY]: 'message',
  [API_RESPONSE_SUCCESS_DATA_KEY]: 'data',
  /** Error Reponse handling */
  [API_RESPONSE_ERROR_STATUS_CODE_KEY]: '',
  [API_ERROR_HANDLER_STATUS_CODES]: [],
  [API_RESPONSE_ERROR_MESSAGE_KEY]: 'error',
  [API_RESPONSE_ERROR_DATA_KEY]: 'data',
};

/* ******  Authentication APIs Start ****** */
export const USER_LOGIN_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: `${API_AUTH_BASE_URL}/auth`,
  [API_METHOD]: 'POST',
  [API_RESPONSE_SUCCESS_DATA_KEY]: '',
};
export const FORGOT_PASSWORD_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: `${API_AUTH_BASE_URL}/auth/forgot-password`,
  [API_METHOD]: 'POST',
};
export const RESET_PASSWORD_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: `${API_AUTH_BASE_URL}/users/reset-password`,
  [API_METHOD]: 'POST',
  [API_RESPONSE_SUCCESS_DATA_KEY]: 'data',
};
export const GET_USER_PROFILE_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: `${API_AUTH_BASE_URL}/users`,
  [API_METHOD]: 'GET',
};
export const UPDATE_PROFILE = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: `${API_AUTH_BASE_URL}/users`,
  [API_METHOD]: 'PUT',
};
export const LOGOUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  [API_URL]: `${API_AUTH_BASE_URL}/auth/logout`,
  [API_METHOD]: 'POST',
};

export const dontResetOnLogout = {};
/* ******  Newsletter APIs End ****** */
