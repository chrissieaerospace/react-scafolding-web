/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState } from 'react';
// import { Switch, Route } from 'react-router-dom';
import history from 'utils/history';
import { ModalLoader } from 'components/common/Loader';
import { useAuthenticationHoc, useQuery, newObject } from '../../Shared/hoc';

import {
  RoutesContainer,
  UiRouteConfig,
  FeRouteConfig,
} from '../../Shared/Routes';
import GlobalStyle from '../../global-styles';
import '../../components/styles/stylesheet.scss';
import '../../components/styles/globalStyles.scss';
import '../../components/styles/commonstyles.scss';
import '../../components/styles/base/_common.scss';
const token = localStorage.getItem('token');
export default function App(props) {
  const [authorization, setAuthorization] = useState(false);
  const {
    reducerName,
    axios,
    actions: { GET_USER_PROFILE_API_CALL },
  } = useAuthenticationHoc();
  useAuthenticationHoc();
  const { isLoggedIn } = useQuery(reducerName, {
    requiredKey: ['isLoggedIn'],
  });
  React.useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      GET_USER_PROFILE_API_CALL({
        callback: {
          updateStateCallback: ({ state, data }) =>
            newObject(state, { profile: data, isLoggedIn: true }),
          finalCallback: () => {
            setAuthorization(true);
          },
          errorCallback: () => {
            delete axios.defaults.headers.common.Authorization;
          },
        },
      });
    } else {
      setAuthorization(true);
    }
  }, []);
  return (
    <div>
      {authorization ? (
        <RoutesContainer
          routes={FeRouteConfig.concat(UiRouteConfig)}
          history={history}
          isLoggedIn={isLoggedIn}
          // profile={profile}
          {...props}
        />
      ) : (
        <ModalLoader isOpen transparent />
      )}
      <GlobalStyle />
    </div>
  );
}
