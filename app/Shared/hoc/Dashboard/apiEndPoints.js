// import { DASHBOARD_BASE_URL } from '../../utils/config';

// const API_BASE_URL = `${BASE_URL}/api/v1/`;
// const API_DASHBOARD_BASE_URL = `${DASHBOARD_BASE_URL}/api`;

// eslint-disable-next-line no-unused-vars
const COMMON_REQUEST_RESPONSE_KEYS = {
  responseStatusCodeKey: 'code',
  responseStatusCode: [900, 910],
  // responseDataKey: 'data',
  responseMessageKey: 'message',
  errorMessageKey: 'error',
  errorDataKey: 'data',
};

/* ******  Dashboard APIs Start ****** */
// export const GET_GRADES_LIST_API = {
//   ...COMMON_REQUEST_RESPONSE_KEYS,
//   url: `${API_DASHBOARD_BASE_URL}/creator-grades`,
//   method: 'GET',
//   responseDataKey: 'data',
// };

export const dontResetOnLogout = {};
