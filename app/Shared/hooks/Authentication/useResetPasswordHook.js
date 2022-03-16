/* eslint-disable indent */
import { useCallback, useState, useRef } from 'react';
import { notification } from 'antd';

import { useAuthenticationHoc, useQuery } from '../../hoc';
// import { mobileReg } from '../../utils/regex';
import Validate from './validator';
notification.config({});
export const useResetPasswordHook = ({ token } = {}) => {
  const {
    reducerName,
    actions: { RESET_PASSWORD_API_CALL },
    reducerConstants: { RESET_PASSWORD_API },
  } = useAuthenticationHoc();

  const valueRef = useRef({});

  const [{ loader: resetPasswordLoader }] = useQuery(reducerName, [
    {
      key: RESET_PASSWORD_API,
      requiredKey: ['loader'],
    },
  ]);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  valueRef.current.confirmPassword = confirmPassword;
  valueRef.current.password = password;

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
  }, [password]);

  const onChangeConfirmPassword = useCallback(e => {
    const value = getPlatformBasedFieldValue(e);
    const error = Validate(value, 'firstName');
    if (error) setConfirmPasswordError(error);
    else setConfirmPasswordError('');
    setConfirmPassword(value);
  }, []);

  const onBlurConfirmPassword = useCallback(() => {
    const error = Validate(valueRef.current.confirmPassword, 'password');
    if (error) setConfirmPasswordError(error);
    else setConfirmPasswordError('');
  }, []);

  const onSubmitResetPassword = useCallback(callback => {
    const error = [];
    const PasswordError = Validate(valueRef.current.password, 'password');
    const ConfirmPasswordError = Validate(
      valueRef.current.confirmPassword,
      'password',
    );
    if (PasswordError) {
      error.push(null);
      setPasswordError(PasswordError);
    }
    if (ConfirmPasswordError) {
      error.push(null);
      setConfirmPasswordError(ConfirmPasswordError);
    }
    const isSame =
      valueRef.current.password === valueRef.current.confirmPassword;
    if (!isSame && !error.length)
      // eslint-disable-next-line no-alert
      notification.error({
        style: {
          zIndex: 103,
        },
        message: 'New password and Confirm password should be the same',
      });
    else if (error.length === 0)
      RESET_PASSWORD_API_CALL({
        request: {
          axiosConfig: !token
            ? undefined
            : {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
          payload: {
            password: valueRef.current.password,
          },
        },
        callback: {
          successCallback: () => {
            // eslint-disable-next-line no-alert

            notification.success({
              message: 'Password resetted successfully',
            });
            callback();
          },
          errorCallback: ({ isNetworkError, message }) => {
            if (isNetworkError || message) {
              notification.error({
                message:
                  typeof message === 'string'
                    ? message
                    : JSON.stringify(message),
              });
            } else {
              notification.error({
                message: 'Something went wrong.Please try again later',
              });
            }
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
    confirmPassword: {
      onChange: onChangeConfirmPassword,
      onBlur: onBlurConfirmPassword,
      value: confirmPassword,
      error: confirmPasswordError,
    },
    resetPassword: {
      loader: resetPasswordLoader,
      submit: onSubmitResetPassword,
    },
    valueRef: valueRef.current,
  };
};
const getPlatformBasedFieldValue = e =>
  typeof e === 'object' ? e.target.value : e;
