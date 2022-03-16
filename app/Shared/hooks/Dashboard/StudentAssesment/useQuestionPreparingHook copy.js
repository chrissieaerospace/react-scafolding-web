/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import { useCallback, useState, useRef } from 'react';
import { generateTimeStamp } from 'react-boilerplate-redux-saga-hoc';
import moment from 'moment';
import { notification } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import {
  useFormValidationHandlerHook,
  useMultipleOptionsHook,
} from '../../Common';
import validator from './validator';

const FORM_DATA_CONFIG = {
  title: {
    isRequired: true,
  },
  description: {
    isRequired: true,
  },
};

export const useQuestionPreparingHook = (
  props,
  { assesmentDetailHookRef } = {},
) => {
  const ref = useRef({});
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
    FORM_CONFIG: FORM_DATA_CONFIG,
  });

  const {
    formRef: questionRef,
    // value: questionForm,
  } = useMultipleOptionsHook();

  const [lessonOptions, setLessonOptions] = useState([]);
  const [selected, setSelected] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(null);

  valueRef.current.selectedUnit = selectedUnit;

  const questionValidator = useCallback((_val = {}) => {
    const { values: _value, errors: _error } = formRef.validateCustomForm({
      values: _val || {},
      formConfig: {
        // image_1: { isRequired: true },
        // image_2: { isRequired: true },
        text: { isRequired: true },
      },
    });
    return {
      error: _error,
      value: _value,
    };
  }, []);

  const questionMatchValidator = useCallback((_val = {}) => {
    const { values: _value, errors: _error } = formRef.validateCustomForm({
      values: _val || {},
      formConfig: {
        // image_1: { isRequired: true },
        // image_2: { isRequired: true },
        text_1: { isRequired: true },
        text_2: { isRequired: true },
      },
    });
    return {
      error: _error,
      value: _value,
    };
  }, []);

  const onSubmitForm = useCallback(() => {
    // const {
    //   value: questionFormValue,
    //   //   error: gradeError,
    //   isError: isQuestionFormError,
    // } = questionRef.validate('questions', gradeValidator, true);

    let validationKey = [];
    let VALIDATOR = questionValidator;
    if (
      ['multiple choice', 'checklist'].includes(
        assesmentDetailHookRef.values.question_type,
      )
    ) {
      validationKey = [
        'questions',
        ...questionRef.formValue.questions.map(e => e.value.optionRef),
      ];
      VALIDATOR = questionValidator;
    } else if (
      ['objective'].includes(assesmentDetailHookRef.values.question_type)
    ) {
      validationKey = ['questions', 'options'];
      VALIDATOR = questionValidator;
    } else if (
      ['match'].includes(assesmentDetailHookRef.values.question_type)
    ) {
      validationKey = ['questions'];
      VALIDATOR = questionMatchValidator;
    }

    const {
      isError: isQuestionError,
      formObj,
      formArray,
    } = questionRef.validate(validationKey, VALIDATOR, true);
    const { values: _values, isError } = validateForm(true);
    console.log(formObj, formArray);
    return {
      isError: isError || isQuestionError,
      payload: !isError
        ? {
            title: _values.title,
            description: _values.description,
          }
        : {},
    };
  }, []);

  const onChangeQuestion = useCallback((key, val, i) => {
    const { value, error } = formRef.onValidateValues({
      value: val,
      config: {
        isRequired: true,
      },
    });
    const previousValue = questionRef.formValue[key][i].value || {};
    questionRef.changeValue(key, i, { ...previousValue, text: value }, error);
  }, []);

  const onChangeMatchQuestion = useCallback(
    (key, val, i, valueKey = 'text') => {
      const { value, error } = formRef.onValidateValues({
        value: val,
        config: {
          isRequired: true,
        },
      });
      const previousValue = questionRef.formValue[key][i].value || {};
      const previousError = questionRef.formValue[key][i].error || {};
      questionRef.changeValue(
        key,
        i,
        { ...previousValue, [valueKey]: value },
        { ...previousError, [valueKey]: error },
      );
    },
    [],
  );
  //   (_question.value || {}).text
  //   (_question.error || {}).text
  //   value={Safe(questionRef, '.formValue.options[1].value.text')}
  //   error={Safe(questionRef, '.formValue.options[1].error.text')}
  //   value={Safe(_question, '.value.text')}
  //   error={Safe(_question, '.error.text')}
  const onChangeValue = useCallback((key, val, i, valueKey = 'text') => {
    const { value, error } = formRef.onValidateValues({
      value: val,
      config: {
        isRequired: true,
      },
    });
    const previousValue = questionRef.formValue[key][i].value || {};
    const previousError = questionRef.formValue[key][i].error || {};
    questionRef.changeValue(
      key,
      i,
      { ...previousValue, [valueKey]: value },
      { ...previousError, [valueKey]: error },
    );
  }, []);

  const onSelectObjectiveQuestionOption = useCallback((key, val, i) => {
    const previousValue = questionRef.formValue[key][i].value || {};
    const error = questionRef.formValue[key][i].error || '';
    questionRef.changeValue(key, i, { ...previousValue, answer: val }, error);
  }, []);

  const onChangeOption = useCallback((key, val, i) => {
    const { value, error } = formRef.onValidateValues({
      value: val,
      config: {
        isRequired: true,
      },
    });
    const previousValue = questionRef.formValue[key][i].value || {};
    questionRef.changeValue(key, i, { ...previousValue, text: value }, error);
  }, []);

  const onDelete = useCallback((key, i) => {
    questionRef.delete(key, i);
  }, []);

  const onDeleteForm = useCallback(key => {
    questionRef.deleteForm(key);
  }, []);

  const onAdd = useCallback((key, value, addIndex) => {
    questionRef.add(key, value, addIndex);
  }, []);

  const onChangeOrder = useCallback((key, currentIndex, moveIndex) => {
    notification.destroy();
    if (currentIndex === moveIndex) {
      notification.error({
        message: 'Please use different index value',
        style: {
          zIndex: 200,
        },
      });
    } else {
      questionRef.changeOrder(key, currentIndex, moveIndex);
      notification.success({
        message: 'Order changed successFully',
        style: {
          zIndex: 200,
        },
      });
    }
  }, []);

  const onSelectMultipleAnswer = useCallback((key, index, _value) => {
    const previousValue = questionRef.formValue[key][index].value || {};
    const error = questionRef.formValue[key][index].error || '';
    questionRef.changeValue(
      key,
      index,
      { ...previousValue, isAnswer: _value },
      error,
    );
  }, []);

  const onSelectSingleAnswer = useCallback((key, index) => {
    const previousFormValue = questionRef.formValue[key] || {};
    const updatedValue = previousFormValue.map((e = {}, i) => ({
      value: { ...e.value, isAnswer: index === i },
      error: e.error,
    }));
    questionRef.resetValue({
      [key]: updatedValue,
    });
  }, []);

  const onDuplicateQuestion = useCallback(questionIndex => {
    const optionRefKey = generateTimeStamp();
    const duplicate_value =
      questionRef.formValue.questions[questionIndex].value;
    onAdd(
      'questions',
      {
        value: {
          ...cloneDeep(duplicate_value),
          optionRef: optionRefKey,
        },
      },
      questionIndex + 1,
    );
    questionRef.addForm({
      [optionRefKey]: cloneDeep(
        questionRef.formValue[duplicate_value.optionRef],
      ),
    });
  }, []);

  const onAddQuestionForm = useCallback(() => {
    if (
      ['multiple choice', 'checklist'].includes(
        assesmentDetailHookRef.values.question_type,
      )
    ) {
      const optionRefKey = generateTimeStamp();
      onAdd('questions', {
        value: {
          text: '',
          optionRef: optionRefKey,
        },
      });
      questionRef.addForm({
        [optionRefKey]: [{}, {}, {}, {}],
      });
    } else if (assesmentDetailHookRef.values.question_type === 'objective') {
      onAdd('questions', {
        value: {
          text: '',
        },
      });
    } else if (assesmentDetailHookRef.values.question_type === 'match') {
      onAdd('questions', {
        value: {},
      });
    }
  }, []);

  const setInitialFormData = useCallback(data => {
    formRef.setInitialFormData({
      title: data.title,
      description: data.description,
      unit_id: data.unit_id,
      grade_id: data.grade_id,
      last_date: moment(data.last_date.split('T')[0], 'YYYY-MM-DD'),
      unit_lesson_select: data.lesson_id
        ? {
            type: 'lesson',
            value: data.lesson_id,
          }
        : { type: 'lesson', value: data.unit_id },
    });
    setSelected(data.lesson_id ? 2 : 1);
    setSelectedUnit(data.unit_id);
    questionRef.resetValue(
      data.grade_options.map(e => ({
        value: e,
        error: '',
      })),
    );
  }, []);

  /* ================ Returns - start ================== */
  const RETURN_OBJECT = {
    onChangeValue,
    onSelectObjectiveQuestionOption,
    onChangeMatchQuestion,
    onSelectMultipleAnswer,
    onSelectSingleAnswer,
    onDuplicateQuestion,
    onDeleteForm,
    onAddQuestionForm,
    questionRef,
    setInitialFormData,
    onChangeQuestion,
    onChangeOrder,
    onChangeOption,
    onDelete,
    onAdd,
    commonInputProps,
    onChangeValues,
    onSubmitForm,
    onBlurValues,
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
