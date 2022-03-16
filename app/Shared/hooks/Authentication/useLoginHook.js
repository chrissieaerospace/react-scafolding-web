import { useCallback, useState, useRef } from 'react';
import { useAuthenticationHoc, useQuery, newObject } from '../../hoc';
// import { mobileReg } from '../../utils/regex';
import { trimStrings } from '../../utils/utilFunctions';
import Validate from './validator';

export const useLoginHook = () => {
  const {
    reducerName,
    actions: { USER_LOGIN_API_CALL },
    reducerConstants: { USER_LOGIN_API },
    axios,
  } = useAuthenticationHoc();

  const valueRef = useRef({});

  const [{ loader: loginloader }] = useQuery(reducerName, [
    {
      key: USER_LOGIN_API,
      requiredKey: ['loader'],
    },
  ]);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  valueRef.current.email_id = email || '';
  valueRef.current.password = password || '';

  const onChangePassword = useCallback(e => {
    const value = getPlatformBasedFieldValue(e);
    const error = Validate(value, 'firstName');
    if (error) setPasswordError(error);
    else setPasswordError('');
    setPassword(value);
  }, []);

  const onBlurPassword = useCallback(() => {
    const error = Validate(valueRef.current.password, 'password');
    if (error) setPasswordError(error);
    else setPasswordError('');
  }, []);

  const onChangeEmail = useCallback(e => {
    const value = getPlatformBasedFieldValue(e);
    const error = Validate(value, 'email');
    if (error) setEmailError(error);
    else setEmailError('');
    setEmail(value);
  }, []);

  const isEmailError = useCallback(value => {
    const trimmedValue = trimStrings(value);
    return [Validate(trimmedValue, 'email'), trimmedValue];
  }, []);

  const onBlurEmail = useCallback(() => {
    const [error, value] = isEmailError(valueRef.current.email_id);
    if (error && valueRef.current.email_id.length) setEmailError(error);
    setEmail(value);
  }, []);

  const onSubmitLogin = useCallback(callback => {
    const error = [];
    const [EmailError, emailValue] = isEmailError(valueRef.current.email_id);
    const PasswordError = Validate(valueRef.current.password, 'password');
    if (EmailError) {
      error.push(null);
      setEmailError(EmailError);
    }
    if (PasswordError) {
      error.push(null);
      setPasswordError(PasswordError);
    }
    if (error.length === 0) {
      delete axios.defaults.headers.common.Authorization;
      USER_LOGIN_API_CALL({
        request: {
          payload: {
            email_id: emailValue,
            password: valueRef.current.password,
          },
        },
        callback: {
          updateStateCallback: ({ state, data }) =>
            newObject(state, { profile: data, isLoggedIn: true }),
          successCallback: ({ data } = {}) => {
            // console.log(data.data.code, 'data');
            // console.log(data.data.data.token, 'token..');
            if (data.data.code === 900) {
              callback(data.data.data.token, data.data.data);
            }
          },
          errorCallback: ({ isNetworkError, message }) => {
            if (isNetworkError || message)
              // eslint-disable-next-line no-alert
              alert(
                typeof message === 'string' ? message : JSON.stringify(message),
              );
          },
        },
      });
    }
  }, []);

  return {
    password: {
      onChange: onChangePassword,
      onBlur: onBlurPassword,
      value: password,
      error: passwordError,
    },
    email: {
      onChange: onChangeEmail,
      onBlur: onBlurEmail,
      value: email,
      error: emailError,
    },
    login: {
      loader: loginloader,
      submit: onSubmitLogin,
    },
    forgotPassword: {},
    axios,
  };
};
const getPlatformBasedFieldValue = e =>
  typeof e === 'object' ? e.target.value : e;
