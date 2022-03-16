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
      {/* <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/forget-password" component={ForgetPassword} />
        <Route exact path="/verify-mail" component={VerifyMail} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route exact path="/create-profile" component={CreateProfile} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/unit-list" component={UnitListing} />
        <Route exact path="/unit-detail" component={UnitDetail} />
        <Route exact path="/create-unit" component={CreateUnit} />
        <Route exact path="/fms-locomotor" component={Locomotor} />
        <Route exact path="/add-locomotor" component={AddLocomotor} />
        <Route exact path="/create-lesson" component={CreateLesson} />
        <Route exact path="/lesson-detail" component={LessonDetail} />
        <Route
          exact
          path="/create-video-assesment"
          component={CreateVideoAssesment}
        />
        <Route
          exact
          path="/create-peer-assesment"
          component={CreatePeerAssesment}
        />
        <Route
          exact
          path="/create-student-assesment"
          component={CreateStudentAssesment}
        />
        <Route exact path="/demo" component={Demo} />
        <Route component={NotFoundPage} />
      </Switch> */}
      <GlobalStyle />
    </div>
  );
}
