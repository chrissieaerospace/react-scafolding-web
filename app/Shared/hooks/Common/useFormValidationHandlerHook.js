/* eslint-disable no-prototype-builtins */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import { useState, useCallback, useRef } from 'react';
import { newObject } from 'react-boilerplate-redux-saga-hoc/utils';
import { generateTimeStamp } from 'react-boilerplate-redux-saga-hoc';
import { ON_CHANGE, ON_BLUR, VALUE, ERROR } from './constants';
import { trimStrings } from '../../utils/utilFunctions';
import Validator from './validator';

const getPlatformBasedFieldValue = e =>
  e && typeof e === 'object' && e.target ? e.target.value : e;
const getPlatformBasedFieldName = e =>
  e && typeof e === 'object' && e.target ? e.target.name : '';

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
  const [values, setValues] = useState(() =>
    Object.entries(formConfig || {}).reduce(
      (acc, [key, val = {}]) =>
        newObject(acc, {
          [key]:
            initialValues[key] ||
            (Object.hasOwnProperty(val, 'default') ? val.default : ''),
        }),
      {},
    ),
  );
  const [errors, setErrors] = useState({});

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
      if (config.maxLength && __value.length > config.maxLength) {
        maxError =
          (config.message && config.message.maxLength) ||
          `maximum ${config.maxLength} characters are allowed`;
        value = value.slice(0, config.maxLength);
        // return;
      }
      if (
        typeof config.trim !== 'undefined' ? config.trim : config.trim || isTrim
      )
        value = trimStrings(value, config.isNumber);
      if (config)
        error =
          Validate(value, config.type, {
            optional: config.optional,
            minLength: config.minLength,
            message: config.message,
            maxLength: config.maxLength,
            length: config.length,
            ...config,
          }) || maxError;
      if (
        key &&
        isSetValue &&
        (config.allowOnlyNumber ? !Number.isNaN(+value) : true)
      )
        setValues(_value => newObject(_value, { [key]: value }));
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
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && isStopPropagation && typeof e.stopPropagation === 'function')
        e.stopPropagation();
      const value =
        typeof _value !== 'undefined' ? _value : getPlatformBasedFieldValue(e);
      const _key = getPlatformBasedFieldName(e);
      const KEY = key || _key;
      if (isValidateOnly || !KEY)
        return validateValue(value, KEY, null, null, config, trim);
      validateValue(value, KEY, true, isSetError, undefined, trim);
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

  const onBlurValues = useCallback((e, key) => {
    const _key = getPlatformBasedFieldName(e);
    const KEY = key || _key;
    const value = formRef.current.values[KEY];
    validateValue(value, KEY, false, true);
  }, []);

  const validateForm = useCallback(
    ({
      isSetError,
      formConfig: __FORM_CONFIG = {},
      values: __values = {},
      errors: __errors = {},
      isNewFormConfig,
    }) => {
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

  const onAddFormConfig = useCallback(
    config => setFormConfig(_formConfig => newObject({}, _formConfig, config)),
    [],
  );

  const commonInputProps = useCallback(
    (
      key,
      {
        onChange = ON_CHANGE_KEY,
        onBlur = ON_BLUR_KEY,
        value = VALUE_KEY,
        error = ERROR_KEY,
      } = {},
    ) => ({
      [onChange]: e => onChangeValues(e, key),
      [onBlur]: e => onBlurValues(e, key),
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
      [],
    );
    setValues(_values);
  }, []);

  const resetForm = useCallback(() => {
    const _values = Object.entries(formConfig || {}).reduce(
      (acc, [key, val = {}]) =>
        newObject(acc, {
          [key]:
            initialValues[key] ||
            (Object.hasOwnProperty(val, 'default') ? val.default : ''),
        }),
      {},
    );
    setValues(_values);
    setErrors({});
  }, []);

  formRef.current.commonInputProps = commonInputProps;
  formRef.current.setInitialFormData = setInitialFormData;
  formRef.current.validateForm = validateForm;
  formRef.current.onBlurValues = onBlurValues;
  formRef.current.onChangeValues = onChangeValues;
  formRef.current.onValidateValues = onValidateValues;
  formRef.current.validateForm = validateForm;
  formRef.current.validateObject = onValidateCustomObject;
  formRef.current.addFormConfig = onAddFormConfig;
  formRef.current.validateCustomForm = validateCustomForm;
  formRef.current.lastUpdated = generateTimeStamp();
  formRef.current.setErrors = setErrors;
  formRef.current.resetForm = resetForm;

  return {
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
