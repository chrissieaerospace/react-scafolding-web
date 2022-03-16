/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import { useCallback, useState, useRef } from 'react';
import { generateTimeStamp } from 'react-boilerplate-redux-saga-hoc';
import { notification } from 'antd';
// import moment from 'moment';
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
const style = {
  zIndex: 200,
};
const ObjectiveOptionRef = {
  value: {
    optionRef: 'options',
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

  const defaultQuestionValidator = useCallback((_val = {}) => {
    const { values: _value, errors: _error } = formRef.validateCustomForm({
      values: _val || {},
      formConfig: {
        // image_1: { isRequired: true },
        // image_2: { isRequired: true },
        text: { isRequired: true, trim: true },
      },
    });
    let error = _error;
    if (_val.optionRef && !error.text) {
      if (
        !questionRef.formValue[_val.optionRef].some(
          e => (e.value || {}).isAnswer,
        )
      )
        error = { text: 'Please select the answer' };
    }
    return {
      error,
      value: _value,
    };
  }, []);

  const objectiveQuestionValidator = useCallback((_val = {}, index, key) => {
    const { values: _value, errors: _error } = formRef.validateCustomForm({
      values: _val || {},
      formConfig: {
        // image_1: { isRequired: true },
        // image_2: { isRequired: true },
        text: { isRequired: true, trim: true },
      },
    });
    let error = _error;
    if (!error.text && !_val.answer && key === 'questions')
      error = {
        text: 'Please select the answer',
      };
    return {
      error,
      value: _value,
    };
  }, []);

  const questionMatchValidator = useCallback((_val = {}) => {
    const { values: _value, errors: _error } = formRef.validateCustomForm({
      values: _val || {},
      formConfig: {
        // image_1: { isRequired: true },
        // image_2: { isRequired: true },
        text_1: { isRequired: true, trim: true },
        text_2: { isRequired: true, trim: true },
        image_1: { isRequired: true, trim: true },
        image_2: { isRequired: true, trim: true },
      },
    });
    return {
      error: _error,
      value: _value,
    };
  }, []);

  const onSubmitForm = useCallback(() => {
    let validationKey = [];
    let VALIDATOR = defaultQuestionValidator;
    if (
      ['multiple choice', 'checklist'].includes(
        assesmentDetailHookRef.values.question_type,
      )
    ) {
      validationKey = [
        'questions',
        ...questionRef.formValue.questions.map(e => e.value.optionRef),
      ];
      VALIDATOR = defaultQuestionValidator;
    } else if (
      ['objective'].includes(assesmentDetailHookRef.values.question_type)
    ) {
      validationKey = ['questions', 'options'];
      VALIDATOR = objectiveQuestionValidator;
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
            question: questionRef.formValue,
          }
        : {},
    };
  }, []);

  const onChangeValue = useCallback((key, val, i, inputKey = 'text') => {
    const { value, error } = formRef.onValidateValues({
      value: val,
      config: {
        isRequired: true,
      },
    });
    const previousValue = questionRef.formValue[key][i].value || {};
    const previousError = questionRef.formValue[key][i].error || {};
    console.log(value);
    questionRef.changeValue({
      key,
      index: i,
      value: { ...previousValue, [inputKey]: value },
      error: { ...previousError, [inputKey]: error },
    });
  }, []);

  const onDelete = useCallback((key, i) => {
    const temp = cloneDeep(questionRef.formValue[key]);
    questionRef.delete(key, i);
    notification.destroy();
    if (key === 'questions') {
      const NOTIFICATION_KEY = generateTimeStamp();
      notification.info({
        key: NOTIFICATION_KEY,
        message: `Question No-${i + 1} deleted.`,
        description: 'click here to undo changes',
        style,
        onClick: () => {
          questionRef.resetValue({
            [key]: temp,
          });
          notification.close(NOTIFICATION_KEY);
        },
      });
    }
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
        style,
      });
    } else {
      questionRef.changeOrder(key, currentIndex, moveIndex);
      notification.info({
        message: 'Order changed successFully',
        style,
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
          ...(assesmentDetailHookRef.values.question_type === 'match'
            ? { answer: undefined }
            : { optionRef: optionRefKey }),
        },
      },
      questionIndex + 1,
    );
    if (assesmentDetailHookRef.values.question_type !== 'match')
      questionRef.addForm({
        [optionRefKey]: cloneDeep(
          questionRef.formValue[duplicate_value.optionRef],
        ),
      });
    notification.destroy();
    notification.info({
      message: `Question No-${questionIndex + 1} duplicated.`,
      style,
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
      onAdd('questions', cloneDeep(ObjectiveOptionRef));
    } else if (assesmentDetailHookRef.values.question_type === 'match') {
      onAdd('questions', {
        value: {},
      });
    }
  }, []);

  const setInitialFormData = useCallback(data => {
    formRef.setInitialFormData({
      description: data.description,
      title: data.title,
    });
    const optionsRef = data.questions.reduce(
      (acc, { question, options }) => ({
        ...acc,
        [question.optionRef]: options,
      }),
      {},
    );
    questionRef.resetForm({
      ...optionsRef,
      questions: data.questions.map(e => ({ value: e.question })),
    });
  }, []);

  /* ================ Returns - start ================== */
  const RETURN_OBJECT = {
    onChangeValue,
    onSelectMultipleAnswer,
    onSelectSingleAnswer,
    onDuplicateQuestion,
    onDeleteForm,
    onAddQuestionForm,
    questionRef,
    setInitialFormData,
    onChangeOrder,
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
