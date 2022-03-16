import { AUTH_BASE_URL } from '../../utils/config';

// const API_BASE_URL = `${BASE_URL}/api/v1/`;
const API_AUTH_BASE_URL = `${AUTH_BASE_URL}/api`;

// eslint-disable-next-line no-unused-vars
const COMMON_REQUEST_RESPONSE_KEYS = {
  responseStatusCodeKey: 'code',
  responseStatusCode: [900, 910],
  responseDataKey: 'data',
  responseMessageKey: 'message',
  errorMessageKey: 'error',
  errorDataKey: 'data',
};

/* ******  Authentication APIs Start ****** */
export const USER_LOGIN_API = {
  url: `${API_AUTH_BASE_URL}/auth`,
  method: 'POST',
  ...COMMON_REQUEST_RESPONSE_KEYS,
  responseDataKey: '',
};
export const FORGOT_PASSWORD_API = {
  url: `${API_AUTH_BASE_URL}/auth/forgot-password`,
  method: 'POST',
  responseDataKey: 'data',
  ...COMMON_REQUEST_RESPONSE_KEYS,
};
export const RESET_PASSWORD_API = {
  url: `${API_AUTH_BASE_URL}/users/reset-password`,
  method: 'POST',
  responseDataKey: 'data',
  ...COMMON_REQUEST_RESPONSE_KEYS,
};
export const GET_USER_PROFILE_API = {
  url: `${API_AUTH_BASE_URL}/users`,
  method: 'GET',
  responseDataKey: 'data',
  ...COMMON_REQUEST_RESPONSE_KEYS,
};
export const UPDATE_PROFILE = {
  url: `${API_AUTH_BASE_URL}/users`,
  method: 'PUT',
  responseDataKey: 'data',
  ...COMMON_REQUEST_RESPONSE_KEYS,
};
export const LOGOUT_API = {
  url: `${API_AUTH_BASE_URL}/auth/logout`,
  method: 'POST',
  responseDataKey: 'data',
  ...COMMON_REQUEST_RESPONSE_KEYS,
};

export const dontResetOnLogout = {};
/* ******  Newsletter APIs End ****** */
