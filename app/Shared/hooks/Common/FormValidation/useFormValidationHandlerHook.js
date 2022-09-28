/* eslint-disable no-nested-ternary */
/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import { useState, useCallback, useRef } from 'react';
import { newObject,generateTimeStamp } from 'react-boilerplate-redux-saga-hoc/utils';
// import isEqual from 'lodash/isEqual';
import { ON_CHANGE, ON_BLUR, VALUE, ERROR } from './constants';
import { trimStrings } from '../../../utils/utilFunctions';
import Validator from './validator';

const getPlatformBasedFieldValue = e =>
  e &&
  typeof e === 'object' &&
  e.target &&
  typeof e.preventDefault === 'function'
    ? e.target.value
    : e;
const getPlatformBasedFieldName = e =>
  e &&
  typeof e === 'object' &&
  e.target &&
  typeof e.preventDefault === 'function'
    ? e.target.name
    : '';

const useFormValidationHandlerHook = ({
  VALIDATOR: Validate = Validator,
  initialValues = {},
  FORM_CONFIG = {},
  ON_CHANGE_KEY = ON_CHANGE,
  ON_BLUR_KEY = ON_BLUR,
  VALUE_KEY = VALUE,
  ERROR_KEY = ERROR,
} = {}) => {
  const [formConfig, setFormConfig] = useState(FORM_CONFIG);
  const formRef = useRef({});
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState(() =>
    Object.entries(formConfig || {}).reduce(
      (acc, [key, val = {}]) =>
        newObject(acc, {
          [key]:
            initialValues[key] ||
            (typeof val.default !== 'undefined' ? val.default : ''),
        }),
      {},
    ),
  );

  formRef.current.values = values;
  formRef.current.errors = errors;
  formRef.current.formConfig = formConfig;
  formRef.current.setFormConfig = setFormConfig;

  const validateValue = useCallback(
    (__value, key, isSetValue, isSetError, _config, isTrim = false) => {
      let value = __value;
      let error = null;
      let maxError = null;
      const config = _config || formRef.current.formConfig[key] || {};
      if (config.maxLength && (__value || '').length > config.maxLength) {
        maxError =
          typeof (config.message && config.message.maxLength) !== 'undefined'
            ? config.message.maxLength
            : `maximum ${config.message.maxLength} characters are allowed`;
        value = value.slice(0, config.maxLength);
        // return;
      }
      if (
        typeof config.trim !== 'undefined' ? config.trim : config.trim || isTrim
      )
        value = trimStrings(value, config.isNumber);
      if (config) {
        error =
          Validate(value, config.type, {
            key,
            optional: config.optional,
            minLength: config.minLength,
            message: config.message,
            maxLength: config.maxLength,
            length: config.length,
            ...config,
          }) || maxError;
        if (
          value &&
          config.match &&
          typeof config.match === 'string' &&
          formRef.current.values[config.match]
        )
          error =
            formRef.current.values[config.match] !== value
              ? typeof (config.message && config.message.match) !== 'undefined'
                ? config.message.match
                : `${key} not matching with ${config.match}`
              : maxError;
      }

      if (key && isSetValue)
        if (
          value !== '' &&
          !Number.isNaN(+value) &&
          !(config.allowValidNumber ? !!+value : true)
        )
          error =
            typeof (config.message && config.message.allowValidNumber) !==
            'undefined'
              ? config.message && config.message.allowValidNumber
              : 'Please enter valid number';
        else if (config.allowOnlyNumber)
          if (!Number.isNaN(+value))
            setValues(_value => newObject(_value, { [key]: value }));
          else
            error =
              typeof (config.message && config.message.allowOnlyNumber) !==
              'undefined'
                ? config.message && config.message.allowOnlyNumber
                : 'Only numbers are allowed';
        else setValues(_value => newObject(_value, { [key]: value }));

      if (!isSetError) return { error, value, key };

      if (key)
        if (error) setErrors(_errors => newObject(_errors, { [key]: error }));
        else setErrors(_errors => newObject(_errors, { [key]: null }));

      return { error, value, key };
    },
    [],
  );

  const onChangeValues = useCallback(
    (
      e = {},
      key,
      {
        value: _value,
        isStopPropagation,
        isValidateOnly,
        config,
        isSetError = true,
        trim,
      } = {},
    ) => {
      formRef.current.isFormChanged = true;
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && isStopPropagation && typeof e.stopPropagation === 'function')
        e.stopPropagation();
      const value =
        typeof _value !== 'undefined' ? _value : getPlatformBasedFieldValue(e);
      const _key = getPlatformBasedFieldName(e);
      const KEY = key || _key;
      if (isValidateOnly || !KEY)
        return validateValue(value, KEY, null, null, config, trim);
      validateValue(
        value,
        KEY,
        true,
        isSetError === undefined ? true : isSetError,
        undefined,
        trim,
      );
    },
    [],
  );

  const onValidateValues = useCallback(
    ({ value, isValue, key, isValidateOnly, config, trim }) =>
      onChangeValues(value, key, {
        value: isValue ? value : undefined,
        isValidateOnly,
        config,
        trim,
      }),
    [],
  );

  const onBlurValues = useCallback((e, key, config = {}) => {
    const _key = getPlatformBasedFieldName(e);
    const KEY = key || _key;
    const value = formRef.current.values[KEY];
    if (config.isValidateOnBlur === undefined ? true : config.isValidateOnBlur)
      validateValue(value, KEY, false, true);
  }, []);

  const validateForm = useCallback(
    ({
      isSetError,
      formConfig: __FORM_CONFIG = {},
      values: __values = {},
      errors: __errors = {},
      isNewFormConfig,
    } = {}) => {
      const _FORM_CONFIG = isNewFormConfig
        ? __FORM_CONFIG
        : newObject(formRef.current.formConfig, __FORM_CONFIG);
      const _values = newObject(formRef.current.values, __values);
      const _errors = newObject(formRef.current.errors, __errors);
      const isError = [];
      for (const key of Object.keys(_FORM_CONFIG)) {
        const { error: _error } = validateValue(
          _values[key],
          key,
          false,
          false,
          _FORM_CONFIG[key],
          true,
        );
        _errors[key] = _error;
        if (_error) isError.push(null);
      }
      if (isSetError) setErrors(_errors);
      return {
        values: _values,
        error: _errors,
        totalErrorCount: isError.length,
        errorCount: isError.length,
        isError: isError.length > 0,
        isValidatePassed: isError.length === 0,
      };
    },
    [],
  );

  const validateCustomForm = useCallback(
    ({
      isSetError,
      formConfig: form_config = {},
      values: __values = {},
      errors: __errors = {},
    }) => {
      const _FORM_CONFIG = form_config;
      const _values = __values;
      const _errors = __errors;
      const isError = [];
      for (const key of Object.keys(_FORM_CONFIG)) {
        const { error: _error } = validateValue(
          _values[key],
          key,
          false,
          false,
          _FORM_CONFIG[key],
        );
        _errors[key] = _error;
        if (_error) isError.push(null);
      }
      if (isSetError) setErrors(_errors);
      return {
        values: _values,
        errors: _errors,
        totalErrorCount: isError.length,
        errorCount: isError.length,
        isError: isError.length > 0,
        isValidatePassed: isError.length === 0,
      };
    },
    [],
  );

  const onValidateCustomObject = useCallback(
    (value, config) =>
      validateForm({ isSetError: false, values: value, formConfig: config }),
    [],
  );

  const onAddFormConfig = useCallback((config, isNew, isReset) => {
    setFormConfig(_formConfig =>
      newObject({}, isNew ? {} : _formConfig, config),
    );
    const newVal = Object.entries(config || {}).reduce(
      (acc, [key, val = {}]) =>
        newObject(acc, {
          [key]:
            initialValues[key] ||
            (!isReset && formRef.current.values[key]) ||
            (typeof val.default !== 'undefined' ? val.default : ''),
        }),
      {},
    );
    setValues(_val => ({ ..._val, ...newVal }));
  }, []);

  const commonInputProps = useCallback(
    (
      key,
      {
        config,
        propKeyMap: {
          onChange = ON_CHANGE_KEY,
          onBlur = ON_BLUR_KEY,
          value = VALUE_KEY,
          error = ERROR_KEY,
        } = {},
      } = {},
    ) => ({
      [onChange]: e => onChangeValues(e, key, config),
      [onBlur]: e => onBlurValues(e, key, config),
      [value]: formRef.current.values[key],
      [error]: formRef.current.errors[key],
    }),
    [],
  );

  const setInitialFormData = useCallback(data => {
    const _values = Object.keys(formRef.current.formConfig).reduce(
      (acc, key) =>
        newObject(acc, {
          [key]:
            typeof data[key] !== 'undefined'
              ? data[key] || ''
              : formRef.current.values[key],
        }),
      {},
    );
    setValues(_values);
  }, []);

  const resetForm = useCallback(() => {
    const _values = Object.entries(formConfig || {}).reduce(
      (acc, [key, val = {}]) =>
        newObject(acc, {
          [key]:
            initialValues[key] ||
            (typeof val.default !== 'undefined' ? val.default : ''),
        }),
      {},
    );
    setValues(_values);
    setErrors({});
  }, []);

  // const isFormChanged = useCallback(
  //   () => !isEqual(formRef.current.initialLoadValues, formRef.current.values),
  //   [],
  // );

  formRef.current.commonInputProps = commonInputProps;
  formRef.current.setInitialFormData = setInitialFormData;
  // formRef.current.validateForm = validateForm;
  formRef.current.onBlurValues = onBlurValues;
  formRef.current.onChangeValues = onChangeValues;
  formRef.current.onValidateValues = onValidateValues;
  formRef.current.validateForm = validateForm;
  formRef.current.validateObject = onValidateCustomObject;
  formRef.current.addFormConfig = onAddFormConfig;
  formRef.current.modifyFormConfig = onAddFormConfig;
  formRef.current.validateCustomForm = validateCustomForm;
  formRef.current.lastUpdated = generateTimeStamp();
  formRef.current.setErrors = setErrors;
  formRef.current.resetForm = resetForm;
  formRef.current.setValues = setValues;
  // formRef.current.isFormChanged = isFormChanged;

  return {
    ...formRef.current,
    validateCustomObject: onValidateCustomObject,
    getPlatformBasedFieldValue,
    formRef: formRef.current,
    setInitialFormData,
    commonInputProps,
    onValidateValues,
    onChangeValues,
    onAddFormConfig,
    setFormConfig,
    validateValue,
    onBlurValues,
    validateForm,
    resetForm,
    setValues,
    setErrors,
    errors,
    values,
  };
};

export default useFormValidationHandlerHook;

/* example
  FORM_CONFIG = {
    name: {
      type: 'string',
      optional: true,
      minLength: 4,
      maxLength: 1,
      extraConfig: {
        isNumber: true
      }
    },
  };
*/
