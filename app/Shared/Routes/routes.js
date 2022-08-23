/* eslint-disable indent */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-return-assign */
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import { useAuthHoc, useQuery } from 'config/hoc';

// import ReactModal from 'react-modal';
// import Modal from 'ui-components/Modal';
// import { useMobileHeaderVisibility } from 'utils/isMobileHook';
// import Authentication from 'containers/Authentication';
import PropTypes from 'prop-types';
// import * as routesConstants from 'config/routeConstants';
// import Header from 'ui-components/Header';
// import Footer from 'containers/Components/Footer';
// import Loader from 'ui-components/loader';
import history from 'utils/history';
// import Qs from 'query-string';
// import { getLanguage } from '../shared/config/Language/index';
// Routes

let initial = true;

const Routes = props => {
  // console.log(status);
  const { isLoggedIn, profile, ...restProps } = props;
  // const query = Qs.parse(history.location.search);
  // console.log(query.header);
  // const [isMobile] = useMobileHeaderVisibility();
  // eslint-disable-next-line no-unused-vars
  // const { authentication: { authorization, isLoggedIn, profile } = {} } = props;

  useEffect(() => {
    // window.scrollTo(0, 0);
  }, [history.location.key]);
  return (
    <React.Fragment>
      <Switch>
        {props.routes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            exact={typeof route.exact === 'undefined' || route.exact}
            render={routingProps => (
              <React.Fragment>
                {(() => {
                  if (isLoggedIn || !route.auth) {
                    if (
                      (route.auth ? isLoggedIn : true) &&
                      route.restrict &&
                      initial
                    )
                      return (
                        <Redirect
                          from={route.path}
                          to={route.restrictRedirect || '/'}
                          route={route}
                        />
                      );
                    if (isLoggedIn && route.loginComponent)
                      return (
                        <route.loginComponent
                          {...routingProps}
                          {...restProps}
                          route={route}
                        />
                      );
                    if (isLoggedIn && route.redirectUrl && !route.restrict)
                      return (
                        <Redirect
                          from={route.path}
                          to={route.redirectUrl}
                          route={route}
                        />
                      );
                    if (isLoggedIn && route.loginRedirect)
                      return (
                        <Redirect
                          from={route.path}
                          to={route.loginRedirect}
                          route={route}
                        />
                      );
                    // if (!isLoggedIn && route.isAuthRequired && !route.auth)
                    //   return (
                    //     <ReactModal isOpen={modal} style={customStyles}>
                    //       <Authentication
                    //         {...props}
                    //         onClose={onModalToggle}
                    //         setModal={setModal}
                    //       />
                    //     </ReactModal>
                    //   );
                    return route.redirectUrl ? (
                      <Redirect
                        from={route.path}
                        to={route.redirectUrl}
                        route={route}
                      />
                    ) : (
                      <route.component
                        {...routingProps}
                        {...restProps}
                        route={route}
                      />
                    );
                  }
                  return (
                    <Redirect from={route.path} to="/login" route={route} />
                  );
                })()}
                {(initial = false)}
                {/* {route.footer && (
                    <Footer
                      history={history}
                      // isLoggedIn={isLoggedIn}
                      authProps={props}
                    />
                  )} */}
              </React.Fragment>
            )}
          />
        ))}
      </Switch>
      {/* )) */}
    </React.Fragment>
  );
};

Routes.defaultProps = {};
Routes.propTypes = {
  routes: PropTypes.array,
  authentication: PropTypes.object,
  dashboard: PropTypes.object,
  getData: PropTypes.object,
  profile: PropTypes.object,
  LIST_ALL_UNIT_FILTER_CARDS_API_CALL: PropTypes.func,
  authorization: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};
export default Routes;
