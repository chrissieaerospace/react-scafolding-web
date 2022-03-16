import { useCallback, useEffect } from 'react';
import { batch } from 'react-redux';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import { notification } from 'antd';

import { useDashboardHoc, useQuery } from '../../../hoc';
import { useFormValidationHandlerHook } from '../../Common';
import validator from './validator';

const FORM_DATA_CONFIG = {
  grade_id: {
    isRequired: true,
    trim: true,
    default: '',
  },
  name: {
    isRequired: true,
  },
  description: {
    isRequired: true,
  },
};
const NotificationMessage = message => ({
  message,
  style: {
    zIndex: 200,
  },
});

export const useCreateLocomotiveHook = props => {
  const {
    reducerName,
    actions: {
      GET_FACULTY_CONTENT_DETAIL_API_CALL,
      GET_FACULTY_CONTENT_DETAIL_API_CANCEL,
      GET_GRADES_LIST_API_CALL,
      GET_GRADES_LIST_API_CANCEL,
      CREATE_FACULTY_CONTENT_POST_API_CALL,
      CREATE_FACULTY_CONTENT_POST_API_CANCEL,
      UPDATE_FACULTY_CONTENT_PUT_API_CALL,
      UPDATE_FACULTY_CONTENT_PUT_API_CANCEL,
    },
    reducerConstants: {
      GET_GRADES_LIST_API,
      GET_FACULTY_CONTENT_DETAIL_API,
      CREATE_FACULTY_CONTENT_POST_API,
      UPDATE_FACULTY_CONTENT_PUT_API,
    },
  } = useDashboardHoc();
  const {
    match: { params: { id } = {} },
  } = props;
  const isEdit = !!id;
  const {
    setInitialFormData,
    commonInputProps,
    onChangeValues,
    onBlurValues,
    validateForm,
    setValues,
    setErrors,
    formRef,
    errors,
    values,
  } = useFormValidationHandlerHook({
    VALIDATOR: validator,
    FORM_CONFIG: FORM_DATA_CONFIG,
  });

  useEffect(() => {
    GET_GRADES_LIST_API_CALL();
    if (id)
      GET_FACULTY_CONTENT_DETAIL_API_CALL({
        request: {
          params: {
            id,
          },
        },
        callback: {
          successCallback: ({ data: { data } = {} }) => {
            setInitialFormData(data);
          },
        },
      });
    return () => {
      batch(() => {
        GET_FACULTY_CONTENT_DETAIL_API_CANCEL(ON_UNMOUNT);
        GET_GRADES_LIST_API_CANCEL(ON_UNMOUNT);
        CREATE_FACULTY_CONTENT_POST_API_CANCEL(ON_UNMOUNT);
        UPDATE_FACULTY_CONTENT_PUT_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);

  const [
    gradeList,
    { loader: createLocomotiveLoader },
    { loader: updateLocomotiveLoader },
    { loader: locomotiveDetailLoader, data },
  ] = useQuery(reducerName, [
    {
      key: GET_GRADES_LIST_API,
      requiredKey: ['loader', 'data'],
      initialLoaderState: true,
    },
    {
      key: CREATE_FACULTY_CONTENT_POST_API,
      requiredKey: ['loader'],
    },
    {
      key: UPDATE_FACULTY_CONTENT_PUT_API,
      requiredKey: ['loader'],
      default: {},
    },
    {
      key: GET_FACULTY_CONTENT_DETAIL_API,
      requiredKey: ['loader', 'data'],
      default: {},
      initialLoaderState: isEdit,
    },
  ]);

  const onSubmitForm = useCallback(() => {
    const { values: _values, isError } = validateForm(true);
    console.log(isError, _values);
    if (!isError) {
      const apiCall = isEdit
        ? UPDATE_FACULTY_CONTENT_PUT_API_CALL
        : CREATE_FACULTY_CONTENT_POST_API_CALL;
      apiCall({
        request: {
          params: {
            id,
          },
          payload: {
            grade_id: isEdit ? undefined : _values.grade_id,
            name: _values.name,
            description: _values.description,
            content_type: props.route.contentType,
          },
        },
        callback: {
          successCallback: () => {
            notification.success(
              NotificationMessage(
                `${props.route.contentType} ${
                  isEdit ? 'updated' : 'created'
                } successfully.`,
              ),
            );
            props.history.goBack();
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
    commonInputProps,
    createLocomotiveLoader,
    updateLocomotiveLoader,
    locomotiveDetailLoader,
    onChangeValues,
    onSubmitForm,
    onBlurValues,
    gradeList,
    setErrors,
    setValues,
    formRef,
    errors,
    values,
    isEdit,
    data,
  };
};
