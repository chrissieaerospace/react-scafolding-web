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
// const customStyles = {
//   content: {
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // margin: 0,
//     // padding: 0,
//     border: 'none',
//     borderRadius: 0,
//     background: 'none',
//   },
//   overlay: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   },
// };
let bannerId = window.localStorage.getItem('banner');
if (bannerId) bannerId = JSON.parse(bannerId);
// const setStorage = id => {
//   window.localStorage.setItem(
//     'banner',
//     JSON.stringify((bannerId || []).concat([id])),
//   );
// };
// const push = (id, filter, setBannerModal) => () => {
//   setStorage(id);
//   setBannerModal(false);
//   history.push({
//     pathname: routesConstants.UNIT_LISTING,
//     search: encodeURIComponent(
//       Qs.stringify({
//         type: filter.split(',').map(e => e.trim()),
//         sort_by: 'demand',
//       }),
//     ),
//   });
// };
const Routes = props => {
  // console.log(status);
  const { isLoggedIn, profile, ...restProps } = props;
  // const query = Qs.parse(history.location.search);
  // console.log(query.header);
  // const [isMobile] = useMobileHeaderVisibility();
  // eslint-disable-next-line no-unused-vars
  // const { authentication: { authorization, isLoggedIn, profile } = {} } = props;
  // const [modal, setModal] = useState(false);
  // const [bannerModal, setBannerModal] = useState(true);
  delete restProps.routes;
  useEffect(() => {
    // window.scrollTo(0, 0);
  }, [history.location.key]);

  // useEffect(() => {
  //   props.LIST_ALL_UNIT_FILTER_CARDS_API_CALL({
  //     query: {
  //       type: 'group_3',
  //     },
  //     filter: ['banner'],
  //   });
  // }, []);

  // const banner = useMemo(
  //   () =>
  //     props.getData(props.dashboard.LIST_ALL_UNIT_FILTER_CARDS_API, [], false, [
  //       'banner',
  //     ]),
  //   [props.dashboard.LIST_ALL_UNIT_FILTER_CARDS_API],
  // );
  // const onModalToggle = useCallback(() => {
  //   setModal(!modal);
  //   history.goBack();
  // }, [modal]);
  // useEffect(() => {
  //   setModal(true);
  // }, [history.location.key]);
  return (
    <React.Fragment>
      {/* {banner.data.length > 0 &&
        isLoggedIn &&
        !(bannerId || []).includes(banner.data[0].id) && (
          <Modal
            isOpen={isMobile ? false : bannerModal}
            LightBoxClose={false}
            color="black"
            onClose={() => {
              setStorage(banner.data[0].id);
              setBannerModal(false);
            }}
            marginBottom="30px"
            isScrollable
            classname="LightBox"
            isAddpropertyHeader
            rootClassName="lightBoxModal"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0px',
                marginTop: '30px',
                width: '100%',
                height: '100%',
              }}
            >
              <img
                srcSet={banner.data[0].url}
                alt=""
                onClick={push(
                  banner.data[0].id,
                  banner.data[0].filter_value,
                  setBannerModal,
                )}
              />
            </div>
          </Modal>
        )} */}
      {/* {authorization && query.header !== 'false' && (
        <Header
          headerProfile={isLoggedIn}
          arrowdown
          language
          key={isLoggedIn}
          // search={route.search}
          login={!isLoggedIn}
          profile={profile}
          history={history}
          languages={languages}
          // path={route.path}
          {...props}
        />
      )}
      {(authorization && ( */}
      {/* {isLoggedIn && <Header profile={profile} />} */}
      {/* {isLoggedIn && <Menu />} */}
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
