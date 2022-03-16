/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState, useRef } from 'react';
import { batch } from 'react-redux';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import moment from 'moment';
import { notification } from 'antd';
import { useDashboardHoc, useQuery } from '../../../hoc';
import {
  useFormValidationHandlerHook,
  useMultipleOptionsHook,
} from '../../Common';
import validator from './validator';

const FORM_DATA_CONFIG = {
  grade_id: {
    isRequired: true,
  },
  title: {
    isRequired: true,
  },
  description: {
    isRequired: true,
  },
  last_date: {
    isRequired: true,
  },
  unit_lesson_select: {
    isRequired: true,
  },
  subject: {
    isRequired: true,
  },
};
const key = 'GRADE';
export const useCreateVideoAssesment = props => {
  const { state: { data: lessonData = {} } = {} } = props.history.location;
  const {
    reducerName,
    actions: {
      GET_GRADES_LIST_API_CALL,
      GET_GRADES_LIST_API_CANCEL,
      LIST_UNITS_API_CALL,
      LIST_UNITS_API_CANCEL,
      CREATE_VIDEO_ASSESSMENT_POST_API_CALL,
      CREATE_VIDEO_ASSESSMENT_POST_API_CANCEL,
      UPDATE_VIDEO_ASSESSMENT_PUT_API_CALL,
      UPDATE_VIDEO_ASSESSMENT_PUT_API_CANCEL,
      GET_VIDEO_ASSESMENT_DETAIL_API_CALL,
      GET_VIDEO_ASSESMENT_DETAIL_API_CANCEL,
    },
    reducerConstants: {
      GET_GRADES_LIST_API,
      LIST_UNITS_API,
      CREATE_VIDEO_ASSESSMENT_POST_API,
      UPDATE_VIDEO_ASSESSMENT_PUT_API,
    },
  } = useDashboardHoc();
  const {
    match: { path, params: { id } = {} },
  } = props;
  const isEdit = path === '/edit-video-assesment/:id';
  const valueRef = useRef({});
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
  const {
    formRef: gradeOptionsRef,
    value: gradeOptions,
  } = useMultipleOptionsHook({ [key]: [{}, {}, {}, {}] });
  const [lessonOptions, setLessonOptions] = useState([]);
  const [selected, setSelected] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
  console.log(gradeOptions);
  valueRef.current.selectedUnit = selectedUnit;
  useEffect(() => {
    if (values.grade_id)
      LIST_UNITS_API_CALL({
        request: {
          query: {
            grade_id: values.grade_id,
          },
        },
      });
  }, [values.grade_id]);

  useEffect(() => {
    GET_GRADES_LIST_API_CALL();

    if (id)
      GET_VIDEO_ASSESMENT_DETAIL_API_CALL({
        request: {
          params: {
            id,
          },
        },
        callback: {
          successCallback: ({ data: { data } = {} }) => {
            setInitialFormData({
              title: data.title,
              description: data.description,
              // unit_id: data.unit_id,
              grade_id: data.grade_id,
              subject: data.subject,
              last_date: moment(data.last_date.split('T')[0], 'YYYY-MM-DD'),
              unit_lesson_select: data.lesson_id
                ? {
                    type: 'lesson',
                    value: data.lesson_id,
                  }
                : { type: 'unit', value: data.unit_id },
            });
            setSelected(data.lesson_id ? 2 : 1);
            setSelectedUnit(data.unit_id);
            gradeOptionsRef.resetValue({
              [key]: data.grade_options.map(e => ({
                value: e,
                error: '',
              })),
            });
          },
        },
      });
    return () => {
      batch(() => {
        LIST_UNITS_API_CANCEL(ON_UNMOUNT);
        CREATE_VIDEO_ASSESSMENT_POST_API_CANCEL(ON_UNMOUNT);
        UPDATE_VIDEO_ASSESSMENT_PUT_API_CANCEL(ON_UNMOUNT);
        GET_VIDEO_ASSESMENT_DETAIL_API_CANCEL(ON_UNMOUNT);
        GET_GRADES_LIST_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);
  const [
    gradeList,
    { loader: unitLessonListLoader, data: { units: unitLessonList = [] } = {} },
    { loader: updateVideoAssesmentLoader },
    { loader: createVideoAssesmentLoader },
  ] = useQuery(reducerName, [
    {
      key: GET_GRADES_LIST_API,
      requiredKey: ['loader', 'data'],
      initialLoaderState: true,
      default: [],
    },
    {
      key: LIST_UNITS_API,
      requiredKey: ['loader', 'data'],
      default: {},
    },
    {
      key: UPDATE_VIDEO_ASSESSMENT_PUT_API,
      requiredKey: ['loader', 'data'],
      default: [],
    },
    {
      key: CREATE_VIDEO_ASSESSMENT_POST_API,
      requiredKey: ['loader', 'data'],
      default: [],
    },
  ]);

  useEffect(() => {
    if (selectedUnit && unitLessonList.length) {
      setLessonOptions(
        (unitLessonList.find(e => e.id === selectedUnit) || {}).lessons,
      );
    }
  }, [selectedUnit, unitLessonListLoader]);

  const gradeValidator = useCallback(_val => {
    const { value: _value, error: _error } = formRef.onValidateValues({
      value: _val || '',
      config: {
        isRequired: true,
      },
    });
    return {
      error: _error,
      value: _value,
    };
  }, []);

  const onSubmitForm = useCallback(() => {
    const {
      value: gradeValue,
      //   error: gradeError,
      isError: isGradeError,
    } = gradeOptionsRef.validate(key, gradeValidator, true);
    const { values: _values, isError } = validateForm(true);
    if (!isError && !isGradeError)
      (isEdit
        ? UPDATE_VIDEO_ASSESSMENT_PUT_API_CALL
        : CREATE_VIDEO_ASSESSMENT_POST_API_CALL)({
        request: {
          params: {
            id,
          },
          payload: {
            ...(_values.unit_lesson_select.type === 'unit'
              ? {
                  unit_id: _values.unit_lesson_select.value,
                  lesson_id: null,
                }
              : {
                  unit_id: valueRef.current.selectedUnit || null,
                  lesson_id: _values.unit_lesson_select.value || null,
                }),
            title: _values.title,
            description: _values.description,
            grade_options: gradeValue,
            last_date: _values.last_date.format('YYYY-MM-DD'),
            grade_id: _values.grade_id,
            subject: _values.subject,
          },
        },
        callback: {
          successCallback: () => {
            if (!isEdit) {
              setInitialFormData({
                title: '',
                description: '',
                unit_id: '',
                grade_options: '',
                last_date: '',
                unit_lesson_select: '',
                subject: '',
              });
              setSelectedUnit(null);
              setLessonOptions([]);
              gradeOptionsRef.resetValue({ [key]: [{}, {}, {}, {}] });
            }

            notification.success({
              message: `Video Assesment ${
                isEdit ? 'Updated' : 'Created'
              } Successfully`,
            });
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
    else
      notification.error({
        message: 'Form validation error',
      });
  }, []);

  const onChangeGradeOptions = useCallback((val, i) => {
    const { value, error } = formRef.onValidateValues({
      value: val,
      config: {
        isRequired: true,
      },
    });
    gradeOptionsRef.changeValue(key, i, value, error);
  }, []);

  const onDeleteGradeOptions = useCallback(i => {
    gradeOptionsRef.delete(key, i);
  }, []);

  const onAddGradeOptions = useCallback(() => {
    gradeOptionsRef.add(key);
  }, []);
  console.log(gradeOptions[key]);
  return {
    updateVideoAssesmentLoader,
    createVideoAssesmentLoader,
    onChangeGradeOptions,
    onDeleteGradeOptions,
    unitLessonListLoader,
    onAddGradeOptions,
    commonInputProps,
    onChangeValues,
    unitLessonList,
    onSubmitForm,
    onBlurValues,
    gradeOptions: gradeOptions[key],
    lessonData,
    gradeList,
    setErrors,
    setValues,
    formRef,
    errors,
    values,
    isEdit,
    lessonOptions,
    setLessonOptions,
    selected,
    setSelected,
    setSelectedUnit,
    selectedUnit,
  };
};
