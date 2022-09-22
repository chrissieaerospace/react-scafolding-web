// import React from 'react';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import { LANDING_PAGE } from './routeConstants';

const ENABLE_AUTH = true;
// const ENABLE_RESTRICT_ROUTE = true;
// const ENABLE_LOGIN_REDIRECT = true;
// const ELSE = undefined;

export default [
  {
    path: LANDING_PAGE,
    auth: ENABLE_AUTH,
    exact: true,
    component: HomePage,
  },

  {
    path: '*',
    exact: true,
    component: NotFoundPage,
  },
];

/* reference - Please don't remove 

{
    path: '/login',
    exact: true,
    component: Login,
    loginRedirect: ENABLE_LOGIN_REDIRECT ? '/' : ELSE,
  },
  {
    path: '/forget-password',
    exact: true,
    component: ForgetPassword,
    loginRedirect: ENABLE_LOGIN_REDIRECT ? '/' : ELSE,
  },
  {
    path: '/verify-mail',
    exact: true,
    component: VerifyMail,
    restrict: ENABLE_RESTRICT_ROUTE,
  },
  {
    path: '/reset-password',
    exact: true,
    component: ResetPassword,
    restrict: ENABLE_RESTRICT_ROUTE,
  },
  {
    path: '/create-profile',
    auth: ENABLE_AUTH,
    exact: true,
    component: CreateProfile,
  restrict: ENABLE_RESTRICT_ROUTE,
  },
  {
    path: '/profile',
    auth: ENABLE_AUTH,
    exact: true,
    component: Profile,
  }

  */
