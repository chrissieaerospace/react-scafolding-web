import { HOC as HocConfigure } from 'react-boilerplate-redux-saga-hoc';
import { newObject, typeOf } from 'react-boilerplate-redux-saga-hoc/utils';
import {
  HOC_MAIN_CLIENT_SIDE_CONFIG_DEFAULT,
  HOC_MAIN_CONFIG_KEY,
  TYPE_BOOLEAN,
  ENV,
} from 'react-boilerplate-redux-saga-hoc/constants';

const IS_DEVELOPMENT =
  process.env.NODE_ENV === ENV.DEVELOPMENT ||
  (typeOf(__DEV__) === TYPE_BOOLEAN && __DEV__);

const EXTRA_CONFIG = {
  [HOC_MAIN_CONFIG_KEY.IS_DEVELOPMENT]: IS_DEVELOPMENT,
};

export const HOC = HocConfigure(
  newObject(HOC_MAIN_CLIENT_SIDE_CONFIG_DEFAULT, EXTRA_CONFIG),
);
