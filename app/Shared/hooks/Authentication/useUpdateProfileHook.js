import { useCallback, useState, useRef } from 'react';
import { notification } from 'antd';
import { useAuthenticationHoc, useQuery, newObject } from '../../hoc';
// import { mobileReg } from '../../utils/regex';
// import { trimStrings } from '../../utils/utilFunctions';
import Validate from './validator';

export const useUpdateProfileHook = ({ isEditProfile } = {}) => {
  const {
    reducerName,
    actions: { UPDATE_PROFILE_CALL },
    reducerConstants: { UPDATE_PROFILE },
  } = useAuthenticationHoc();

  const valueRef = useRef({});

  const [{ loader: profileloader }, { profile }] = useQuery(reducerName, [
    {
      key: UPDATE_PROFILE,
      requiredKey: ['loader'],
    },
    { requiredKey: ['profile'] },
  ]);
  const [name, setName] = useState(() =>
    isEditProfile ? profile.name || '' : '',
  );
  const [nameErr, setNameErr] = useState('');
  const [mobileNumber, setMoobileNumber] = useState(
    isEditProfile ? profile.mobile_number || '' : '',
  );
  const [profileImage, setProfileImage] = useState(
    isEditProfile ? profile.profile_image_url || '' : '',
  );
  const [mobileErr, setMobileErr] = useState('');
  const [about, setAbout] = useState(isEditProfile ? profile.about || '' : '');
  const [aboutErr, setAboutErr] = useState('');

  valueRef.current.name = name || '';
  valueRef.current.mobileNumber = mobileNumber || '';
  valueRef.current.about = about || '';
  valueRef.current.profileImage = profileImage || '';

  const onChangeName = useCallback(e => {
    const value = getPlatformBasedFieldValue(e);
    const error = Validate(value, 'name');
    if (error) setNameErr(error);
    else setNameErr('');
    setName(value);
  }, []);

  const onBlurName = useCallback(() => {
    const error = Validate(valueRef.current.name, 'name');
    if (error) setNameErr(error);
    else setNameErr('');
  }, []);

  const onChangeMobile = e => {
    const value = getPlatformBasedFieldValue(e);
    if (mobileErr) {
      setMobileErr('');
    }
    if ((Number(value) === 0 || Number(value)) && value.length <= 10)
      setMoobileNumber(value);
  };

  const onChangeAbout = useCallback(e => {
    const value = getPlatformBasedFieldValue(e);
    const error = Validate(value, 'about');
    if (error) setAboutErr(error);
    else setAboutErr('');
    setAbout(value);
  }, []);

  const onBlurAbout = useCallback(() => {
    const error = Validate(valueRef.current.about, 'about');
    if (error) setAboutErr(error);
    else setAboutErr('');
  }, []);

  //   const isEmailError = useCallback(value => {
  //     const trimmedValue = trimStrings(value);
  //     return [Validate(trimmedValue, 'email'), trimmedValue];
  //   }, []);

  const onBlurMobile = useCallback(() => {
    const error = Validate(valueRef.current.mobileNumber, 'mobileNumber');
    if (error) setMobileErr(error);
    else setMobileErr('');
  }, []);

  const onSubmitProfile = useCallback(callback => {
    const error = [];
    // const [EmailError, emailValue] = isEmailError(valueRef.current.email_id);
    const nameError = Validate(valueRef.current.name, 'name');
    const mobileError = Validate(valueRef.current.mobileNumber, 'mobileNumber');
    const aboutError = Validate(valueRef.current.about, 'about');
    // console.log(valueRef.current.name, '');
    // console.log(valueRef.current.mobileNumber, '');
    // console.log(valueRef.current.about, '');
    // const nameError = validate(valueRef.current.name);
    if (nameError) {
      error.push(null);
      setNameErr(nameError);
    }
    if (mobileError) {
      error.push(null);
      setMobileErr(mobileError);
    }
    if (aboutError) {
      error.push(null);
      setAboutErr(aboutError);
    }
    // console.log(error, 'error');
    if (error.length === 0) {
      if (!valueRef.current.profileImage)
        notification.error({
          message: 'Please upload profile image',
        });
      else
        UPDATE_PROFILE_CALL({
          request: {
            payload: {
              name: valueRef.current.name,
              mobile_number: valueRef.current.mobileNumber,
              profile_image_url: valueRef.current.profileImage || '',
              about: valueRef.current.about,
            },
          },
          callback: {
            updateStateCallback: ({ state }) =>
              newObject(state, {
                profile: newObject(state.profile, {
                  name: valueRef.current.name,
                  mobile_number: valueRef.current.mobileNumber,
                  profile_image_url: valueRef.current.profileImage || '',
                  about: valueRef.current.about,
                }),
              }),
            successCallback: ({ data: { data: { token } = {} } = {} }) => {
              callback(token);
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
    }
  }, []);

  return {
    name: {
      onChange: onChangeName,
      onBlur: onBlurName,
      value: name,
      error: nameErr,
    },
    mobileNumber: {
      onChange: onChangeMobile,
      onBlur: onBlurMobile,
      value: mobileNumber,
      error: mobileErr,
    },
    about: {
      onChange: onChangeAbout,
      onBlur: onBlurAbout,
      value: about,
      error: aboutErr,
    },
    submitProfile: {
      loader: profileloader,
      submit: onSubmitProfile,
    },
    profile,
    setProfileImage,
    profileImage,
  };
};
const getPlatformBasedFieldValue = e =>
  typeof e === 'object' ? e.target.value : e;
