import { DASHBOARD_BASE_URL } from '../../utils/config';

// const API_BASE_URL = `${BASE_URL}/api/v1/`;
const API_DASHBOARD_BASE_URL = `${DASHBOARD_BASE_URL}/api`;

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
export const GET_GRADES_LIST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/creator-grades`,
  method: 'GET',
  responseDataKey: 'data',
};

/** units - start  */
export const LIST_UNITS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/units`,
  method: 'GET',
  responseDataKey: 'data',
};
export const GET_UNIT_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/units/${id}`,
  method: 'GET',
  responseDataKey: 'data',
};

export const CREATE_UNIT_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/units`,
  method: 'POST',
  responseDataKey: 'data',
};

export const UPDATE_UNITS_PUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/units/${id}`,
  method: 'PUT',
  responseDataKey: 'data',
};

export const DELETE_UNITS_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/units/${id}`,
  method: 'DELETE',
  responseDataKey: 'data',
};

/** Lessons - start */
export const GET_LESSON_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/lessons/${id}`,
  method: 'GET',
  responseDataKey: 'data',
};

export const CREATE_LESSON_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/lessons`,
  method: 'POST',
  responseDataKey: 'data',
};

export const UPDATE_LESSON_PUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/lessons/${id}`,
  method: 'PUT',
  responseDataKey: 'data',
};

export const DELETE_LESSON_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/lessons/${id}`,
  method: 'DELETE',
  responseDataKey: 'data',
};

/** video assesment - start */
export const GET_VIDEO_ASSESMENT_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/assesments/${id}`,
  method: 'GET',
  responseDataKey: 'data',
};
export const GET_STUDENT_PEER_ASSESMENT_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/assesments/${id}`,
  method: 'GET',
  responseDataKey: 'data',
};

export const LIST_ASSESMENT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/assesments`,
  method: 'GET',
  responseDataKey: 'data',
};

export const DELETE_VIDEO_ASSESSMENT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/assesments/${id}`,
  method: 'DELETE',
  responseDataKey: 'data',
};

export const CREATE_VIDEO_ASSESSMENT_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/assesments/video`,
  method: 'POST',
  responseDataKey: 'data',
};

export const UPDATE_VIDEO_ASSESSMENT_PUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/assesments/video/${id}`,
  method: 'PUT',
  responseDataKey: 'data',
};

export const CREATE_STUDENT_ASSESSMENT_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/assesments/student`,
  method: 'POST',
  responseDataKey: 'data',
};

export const UPDATE_STUDENT_ASSESSMENT_PUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/assesments/student/${id}`,
  method: 'PUT',
  responseDataKey: 'data',
};

export const CREATE_PEER_ASSESSMENT_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/assesments/peer`,
  method: 'POST',
  responseDataKey: 'data',
};

export const UPDATE_PEER_ASSESSMENT_PUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/assesments/peer/${id}`,
  method: 'PUT',
  responseDataKey: 'data',
};

/** locomotive - start */
export const LIST_FACULTY_CONTENT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/faculty-contents`,
  method: 'GET',
  responseDataKey: 'data',
};
export const GET_FACULTY_CONTENT_DETAIL_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/faculty-contents/${id}`,
  method: 'GET',
  responseDataKey: 'data',
};

export const CREATE_FACULTY_CONTENT_POST_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: `${API_DASHBOARD_BASE_URL}/faculty-contents`,
  method: 'POST',
  responseDataKey: 'data',
};

export const UPDATE_FACULTY_CONTENT_PUT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/faculty-contents/${id}`,
  method: 'PUT',
  responseDataKey: 'data',
};

export const DELETE_FACULTY_CONTENT_API = {
  ...COMMON_REQUEST_RESPONSE_KEYS,
  url: ({ id }) => `${API_DASHBOARD_BASE_URL}/faculty-contents/${id}`,
  method: 'DELETE',
  responseDataKey: 'data',
};
/** locomotive - end */

export const dontResetOnLogout = {};
