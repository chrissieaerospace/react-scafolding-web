/**
 * This is axios intercepter which intercepts all the incoming and outgoing requests
 */
import axios from 'axios';
// import { getCmJWTToken, getCookie, setCookie } from '../utils/token';
// import {
//   BASE_URL,
//   // AUTH_BASE_URL,
//   ACAST_BASE_URL,
//   ACAST_XAPI_KEY,
//   CM_BASE_URL,
// } from '../utils/config';

// const checkCookie = async () => {
//   const cookie = await getCookie();
//   return cookie;
// };

const request = axios.create({});

request.defaults.withCredentials = true;

// request.defaults.headers.common['x-api-key'] = ACAST_XAPI_KEY;

// checkCookie((cookies) => {
//   if (cookies) {
//     request.defaults.headers.common.cookie = cookies;
//   }
// });

// request.defaults.headers.origin = BASE_URL;
// request.interceptors.request.use(async (config) => {
//   // if (!config.baseURL) {
//   //   request.defaults.baseURL = BASE_URL;
//   //   config.baseURL = BASE_URL; // eslint-disable-line no-param-reassign
//   // }

//   const cookie = await getCookie();
//   if (cookie) {
//     request.defaults.headers.common.cookie = cookie;
//   }

//   if (config.url.includes(CM_BASE_URL)) {
//     if (!config.headers.Authorization) {
//       const token = await getCmJWTToken();
//       if (token && config.url && config.url.includes(CM_BASE_URL)) {
//         request.defaults.headers.common.Authorization = `Bearer ${token}`;
//       }
//     }
//   }

//   // Setting X API KEY token in ACASt url
//   if (config.url && config.url.includes(ACAST_BASE_URL)) {
//     request.defaults.headers.common['x-api-key'] = ACAST_XAPI_KEY;
//   }

//   return config;
// });

// // add more urls based on api to update urls
// request.interceptors.response.use((response) => {
//   if (
//     response &&
//     response.config &&
//     response.headers &&
//     response.headers['set-cookie'] &&
//     response.headers['set-cookie'].length
//     // &&
//     // (response.config.url === DASHBOARD_API_END_POINTS.REGISTER_API.url ||
//     //   response.config.url === DASHBOARD_API_END_POINTS.LOGIN_API.url)
//   ) {
//     const cookie = response.headers['set-cookie'][0];
//     request.defaults.headers.common.cookie = cookie;
//     setCookie(cookie);
//   }
//   return response;
// });

export default request;
