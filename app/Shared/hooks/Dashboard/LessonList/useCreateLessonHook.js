import { useCallback, useEffect } from 'react';
import { batch } from 'react-redux';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import { notification } from 'antd';

import { useDashboardHoc, useQuery } from '../../../hoc';
import { useFormValidationHandlerHook } from '../../Common';
import validator from './validator';

const FORM_DATA_CONFIG = {
  name: {
    isRequired: true,
  },
  description: {
    isRequired: true,
  },
  body: {
    isRequired: true,
  },
  plan: {
    optional: true,
  },
};
const NotificationMessage = message => ({
  message,
  style: {
    zIndex: 200,
  },
});
export const useCreateLessonHook = props => {
  const {
    state: { id: unitId, data: lessonData = {} } = {},
  } = props.history.location;
  const {
    reducerName,
    actions: {
      GET_LESSON_DETAIL_API_CALL,
      GET_LESSON_DETAIL_API_CANCEL,
      CREATE_LESSON_POST_API_CALL,
      CREATE_LESSON_POST_API_CANCEL,
      UPDATE_LESSON_PUT_API_CALL,
      UPDATE_LESSON_PUT_API_CANCEL,
    },
    reducerConstants: {
      GET_LESSON_DETAIL_API,
      CREATE_LESSON_POST_API,
      UPDATE_LESSON_PUT_API,
    },
  } = useDashboardHoc();
  const {
    match: { path, params: { id } = {} },
  } = props;
  const isEdit = path === '/edit-lesson/:id';
  const {
    setInitialFormData,
    commonInputProps,
    onChangeValues,
    validateValue,
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
    if (id)
      GET_LESSON_DETAIL_API_CALL({
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
        GET_LESSON_DETAIL_API_CANCEL(ON_UNMOUNT);
        CREATE_LESSON_POST_API_CANCEL(ON_UNMOUNT);
        UPDATE_LESSON_PUT_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);

  const [
    { loader: createLessonLoader },
    { loader: updateLessonLoader },
    { loader: lessonDetailLoader, data },
  ] = useQuery(reducerName, [
    {
      key: CREATE_LESSON_POST_API,
      requiredKey: ['loader'],
    },
    {
      key: UPDATE_LESSON_PUT_API,
      requiredKey: ['loader'],
      default: {},
    },
    {
      key: GET_LESSON_DETAIL_API,
      requiredKey: ['loader', 'data'],
      default: {},
      initialLoaderState: isEdit,
    },
  ]);

  const onSubmitForm = useCallback(() => {
    const { values: _values, isError } = validateForm(true);
    if (!isError)
      (isEdit ? UPDATE_LESSON_PUT_API_CALL : CREATE_LESSON_POST_API_CALL)({
        request: {
          params: {
            id,
          },
          payload: {
            unit_id: isEdit ? undefined : unitId,
            name: _values.name,
            description: _values.description,
            body: _values.body,
            plan: _values.plan,
          },
        },
        callback: {
          successCallback: () => {
            notification.success(
              NotificationMessage(
                `Unit ${isEdit ? 'updated' : 'created'} successfully.`,
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
  }, []);

  return {
    commonInputProps,
    createLessonLoader,
    updateLessonLoader,
    lessonDetailLoader,
    onChangeValues,
    validateValue,
    onSubmitForm,
    onBlurValues,
    lessonData,
    setErrors,
    setValues,
    formRef,
    errors,
    values,
    isEdit,
    data,
  };
};
