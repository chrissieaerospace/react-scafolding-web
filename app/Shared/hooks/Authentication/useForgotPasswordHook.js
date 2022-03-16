import { useCallback, useState, useRef } from 'react';
import { useAuthenticationHoc, useQuery } from '../../hoc';
// import { mobileReg } from '../../utils/regex';
import { trimStrings } from '../../utils/utilFunctions';
import Validate from './validator';

export const useForgotPasswordHook = () => {
  const {
    reducerName,
    actions: { FORGOT_PASSWORD_API_CALL },
    reducerConstants: { FORGOT_PASSWORD_API },
  } = useAuthenticationHoc();

  const valueRef = useRef({});

  const [{ loader: forgetPasswordLoader }] = useQuery(reducerName, [
    {
      key: FORGOT_PASSWORD_API,
      requiredKey: ['loader'],
    },
  ]);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  valueRef.current.email_id = email;
  valueRef.current.password = password;

  const onChangePassword = useCallback(e => {
    const value = getPlatformBasedFieldValue(e);
    const error = Validate(value, 'firstName');
    if (error) setPasswordError(error);
    else setPasswordError('');
    setPassword(value);
  }, []);

  const onBlurPassword = useCallback(() => {
    const error = Validate(password, 'password');
    if (error) setPasswordError(error);
    else setPasswordError('');
  }, [password]);

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
    const [error, value] = isEmailError(email);
    if (error && email.length) setEmailError(error);
    setEmail(value);
  }, [email]);

  const onSubmitForgotPassword = useCallback(callback => {
    const error = [];
    const [EmailError, emailValue] = isEmailError(valueRef.current.email_id);
    if (EmailError) {
      error.push(null);
      setEmailError(EmailError);
    }
    if (error.length === 0)
      FORGOT_PASSWORD_API_CALL({
        request: {
          payload: {
            email_id: emailValue,
          },
        },
        callback: {
          successCallback: ({ data: { data: { token } = {} } = {} }) => {
            callback(token);
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
    forgotPassword: {
      loader: forgetPasswordLoader,
      submit: onSubmitForgotPassword,
    },
    valueRef: valueRef.current,
  };
};
const getPlatformBasedFieldValue = e =>
  typeof e === 'object' ? e.target.value : e;
