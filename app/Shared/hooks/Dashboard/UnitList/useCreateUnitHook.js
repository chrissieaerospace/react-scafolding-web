import { useCallback, useEffect } from 'react';
import { batch } from 'react-redux';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import { notification } from 'antd';
import moment from 'moment';
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
  duration: {
    isRequired: true,
  },
  more_info: {
    isRequired: true,
  },
  cover_image: {
    isRequired: true,
  },
  attachments: {},
};
const NotificationMessage = message => ({
  message,
  style: {
    zIndex: 200,
  },
});

export const useCreateUnitHook = props => {
  const {
    reducerName,
    actions: {
      GET_UNIT_DETAIL_API_CALL,
      GET_UNIT_DETAIL_API_CANCEL,
      GET_GRADES_LIST_API_CALL,
      GET_GRADES_LIST_API_CANCEL,
      CREATE_UNIT_POST_API_CALL,
      CREATE_UNIT_POST_API_CANCEL,
      UPDATE_UNITS_PUT_API_CALL,
      UPDATE_UNITS_PUT_API_CANCEL,
    },
    reducerConstants: {
      GET_GRADES_LIST_API,
      GET_UNIT_DETAIL_API,
      CREATE_UNIT_POST_API,
      UPDATE_UNITS_PUT_API,
    },
  } = useDashboardHoc();
  const {
    match: { path, params: { id } = {} },
  } = props;
  const isEdit = path === '/edit-unit/:id';
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
      GET_UNIT_DETAIL_API_CALL({
        request: {
          params: {
            id,
          },
        },
        callback: {
          successCallback: ({ data: { data } = {} }) => {
            setInitialFormData({
              ...data,
              duration: moment(data.duration, 'hh:mm'),
            });
          },
        },
      });
    return () => {
      batch(() => {
        GET_UNIT_DETAIL_API_CANCEL(ON_UNMOUNT);
        GET_GRADES_LIST_API_CANCEL(ON_UNMOUNT);
        CREATE_UNIT_POST_API_CANCEL(ON_UNMOUNT);
        UPDATE_UNITS_PUT_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);

  const [
    gradeList,
    { loader: createUnitLoader },
    { loader: updateUnitLoader },
    { loader: unitDetailLoader, data },
  ] = useQuery(reducerName, [
    {
      key: GET_GRADES_LIST_API,
      requiredKey: ['loader', 'data'],
      initialLoaderState: true,
    },
    {
      key: CREATE_UNIT_POST_API,
      requiredKey: ['loader'],
    },
    {
      key: UPDATE_UNITS_PUT_API,
      requiredKey: ['loader'],
      default: {},
    },
    {
      key: GET_UNIT_DETAIL_API,
      requiredKey: ['loader', 'data'],
      default: {},
      initialLoaderState: isEdit,
    },
  ]);

  const onSubmitForm = useCallback(() => {
    const { values: _values, isError } = validateForm(true);
    if (!isError) {
      if (!_values.attachments && false)
        notification.error(NotificationMessage(`Please add the attachments`));
      else
        (isEdit ? UPDATE_UNITS_PUT_API_CALL : CREATE_UNIT_POST_API_CALL)({
          request: {
            params: {
              id,
            },
            payload: {
              grade_id: isEdit ? undefined : _values.grade_id,
              name: _values.name,
              description: _values.description,
              duration: _values.duration.format('hh:mm'),
              more_info: _values.more_info,
              attachments: _values.attachments,
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
    }
  }, []);

  return {
    commonInputProps,
    createUnitLoader,
    updateUnitLoader,
    unitDetailLoader,
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
