/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState, useRef } from 'react';
import { batch } from 'react-redux';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import moment from 'moment';
import { useDashboardHoc, useQuery } from '../../../hoc';
import {
  useFormValidationHandlerHook,
  useMultipleOptionsHook,
} from '../../Common';
import validator from './validator';

const FORM_DATA_STUDENT_ASSESSMENT_CONFIG = {
  grade_id: {
    isRequired: true,
  },
  subject: {
    isRequired: true,
  },
  question_type: {
    isRequired: true,
  },
  last_date: {
    isRequired: true,
  },
  unit_lesson_select: {
    isRequired: true,
  },
};
const FORM_DATA_PEER_ASSESSMENT_CONFIG = {
  grade_id: {
    isRequired: true,
  },
  subject: {
    isRequired: true,
  },
  question_type: {
    isRequired: true,
  },
  last_date: {
    isRequired: true,
  },
};
const gradeKey = 'GRADE';

export const useAssesmentDetailHook = (props, { isPeerAssessment } = {}) => {
  const ref = useRef({});
  const { state: { data: lessonData = {} } = {} } = props.history.location;
  const {
    reducerName,
    actions: {
      GET_GRADES_LIST_API_CALL,
      GET_GRADES_LIST_API_CANCEL,
      LIST_UNITS_API_CALL,
      LIST_UNITS_API_CANCEL,
    },
    reducerConstants: { GET_GRADES_LIST_API, LIST_UNITS_API },
  } = useDashboardHoc();
  // const {
  //   // eslint-disable-next-line no-unused-vars
  //   match: { path, params: { id } = {} },
  // } = props;
  // const isPeerAssessment = path === '/create-peer-assesment';
  // const isEdit = path === '/edit-video-assesment/:id';
  const valueRef = useRef({});
  const {
    // setInitialFormData,
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
    FORM_CONFIG: isPeerAssessment
      ? FORM_DATA_PEER_ASSESSMENT_CONFIG
      : FORM_DATA_STUDENT_ASSESSMENT_CONFIG,
  });
  const {
    formRef: gradeOptionsRef,
    formValue: { [gradeKey]: gradeOptions },
  } = useMultipleOptionsHook({ [gradeKey]: [{}, {}, {}, {}] });
  const [lessonOptions, setLessonOptions] = useState([]);
  const [selected, setSelected] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);
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
    return () => {
      batch(() => {
        LIST_UNITS_API_CANCEL(ON_UNMOUNT);
        GET_GRADES_LIST_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);
  const [
    { data: gradeList, loader: gradeListLoader },
    { loader: unitLessonListLoader, data: { units: unitLessonList = [] } = {} },
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

  const onSubmitGradeOptionsForm = useCallback(() => {
    const {
      value: gradeValue,
      //   error: gradeError,
      isError,
    } = gradeOptionsRef.validate(gradeKey, gradeValidator, true);
    return {
      isError,
      payload: !isError
        ? {
            grade_options: gradeValue,
          }
        : {},
    };
  }, []);

  const onSubmitDetailSelectionForm = useCallback(() => {
    const { values: _values, isError } = validateForm(true);
    return {
      isError,
      payload: !isError
        ? {
            ...(isPeerAssessment
              ? {}
              : _values.unit_lesson_select.type === 'unit'
              ? {
                  unit_id: _values.unit_lesson_select.value,
                  lesson_id: null,
                }
              : {
                  unit_id: valueRef.current.selectedUnit || null,
                  lesson_id: _values.unit_lesson_select.value || null,
                }),
            subject: _values.subject,
            question_type: _values.question_type,
            // grade_options: gradeValue,
            last_date: _values.last_date.format('YYYY-MM-DD'),
            grade_id: _values.grade_id,
          }
        : {},
    };
  }, []);

  const onChangeGradeOptions = useCallback((val, i) => {
    const { value, error } = formRef.onValidateValues({
      value: val,
      config: {
        isRequired: true,
      },
    });
    gradeOptionsRef.changeValue(gradeKey, i, value, error);
  }, []);

  const onDeleteGradeOptions = useCallback(i => {
    gradeOptionsRef.delete(gradeKey, i);
  }, []);

  const onAddGradeOptions = useCallback(() => {
    gradeOptionsRef.add(gradeKey);
  }, []);

  const setInitialFormData = useCallback(data => {
    formRef.setInitialFormData({
      title: data.title,
      description: data.description,
      unit_id: data.unit_id,
      grade_id: data.grade_id,
      subject: data.subject,
      question_type: data.question_type,
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
      [gradeKey]: data.grade_options.map(e => ({
        value: e,
        error: '',
      })),
    });
  }, []);
  /* ================ Returns - start ================== */
  const RETURN_OBJECT = {
    gradeOptionsRef,
    setInitialFormData,
    gradeListLoader,
    onChangeGradeOptions,
    onDeleteGradeOptions,
    unitLessonListLoader,
    onAddGradeOptions,
    commonInputProps,
    onChangeValues,
    unitLessonList,
    onSubmitDetailSelectionForm,
    onSubmitGradeOptionsForm,
    onBlurValues,
    gradeOptions,
    lessonData,
    gradeList,
    setErrors,
    setValues,
    formRef,
    errors,
    values,
    lessonOptions,
    setLessonOptions,
    selected,
    setSelected,
    setSelectedUnit,
    selectedUnit,
  };

  Object.entries(RETURN_OBJECT).forEach(([key, value]) => {
    ref.current[key] = value;
  });

  return {
    ref: ref.current,
    ...RETURN_OBJECT,
  };

  /* ================ Returns - End ================== */
};
