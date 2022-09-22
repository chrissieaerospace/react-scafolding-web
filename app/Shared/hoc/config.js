import {
  HOC as HocConfigure,
  newObject,
} from 'react-boilerplate-redux-saga-hoc';
import {
  HOC_MAIN_CLIENT_SIDE_CONFIG_DEFAULT,
  HOC_MAIN_CONFIG_KEY,
} from 'react-boilerplate-redux-saga-hoc/constants';

const DEVELOPMENT = 'development';
const EXTRA_CONFIG = {
  [HOC_MAIN_CONFIG_KEY.IS_DEVELOPMENT]: process.env.NODE_ENV === DEVELOPMENT,
};

export const HOC = HocConfigure(
  newObject(HOC_MAIN_CLIENT_SIDE_CONFIG_DEFAULT, EXTRA_CONFIG),
);
