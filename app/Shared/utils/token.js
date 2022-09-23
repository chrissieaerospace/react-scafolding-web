import AsyncStorage from '@react-native-async-storage/async-storage';
// import CookieManager from '@react-native-cookies/cookies';

export const getCmJWTToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const setCmJWTToken = async (token) => {
  const JWTToken = await AsyncStorage.setItem('token', token);
  return JWTToken;
};

export const getFontSize = async () => {
  const selectedFont = await AsyncStorage.getItem('selectedFont');
  return selectedFont;
};

export const setFontSize = async (font) => {
  const selectedFont = await AsyncStorage.setItem('selectedFont', font);
  return selectedFont;
};

export const getCookie = async () => {
  // await CookieManager.clearAll();
  const cookie = await AsyncStorage.getItem('cookie');
  return cookie;
};

export const setCookie = async (cookie) => {
  const cookieInfo = await AsyncStorage.setItem('cookie', cookie);
  return cookieInfo;
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const getCMIntegrationToken = async () => {
  const cmIntegrationToken = await AsyncStorage.getItem('cmIntegrationToken');
  return cmIntegrationToken;
};

export const setCMIntegrationToken = async (token) => {
  const cmIntegrationToken = await AsyncStorage.setItem(
    'cmIntegrationToken',
    token,
  );
  return cmIntegrationToken;
};

export const getAccessTypeJWTToken = async () => {
  const accessTypeToken = await AsyncStorage.getItem('accessTypeToken');
  return accessTypeToken;
};

export const setAccessTypeJWTToken = async (token) => {
  const accessTypeToken = await AsyncStorage.setItem('accessTypeToken', token);
  return accessTypeToken;
};

export const setUserInfo = (userInfo = {}) => {
  AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = async () => {
  const user = await AsyncStorage.getItem('userInfo');
  let userInfo = {};
  try {
    userInfo = JSON.parse(user) || {};
  } catch (e) {
    userInfo = {};
  }
  return userInfo;
};

export const getOnBoardingScreenStatus = async () => {
  const status = await AsyncStorage.getItem('onBoarded');
  return status;
};

export const setOnBoardingScreenStatus = async (key) => {
  const status = await AsyncStorage.setItem('onBoarded', key);
  return status;
};

export const getAuthSkipStatus = async () => {
  const status = await AsyncStorage.getItem('isSkipped');
  return status;
};

export const setAuthSkipStatus = async (key) => {
  const status = await AsyncStorage.setItem('isSkipped', key);
  return status;
};
