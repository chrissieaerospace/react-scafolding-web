import { toCapitalize } from 'react-boilerplate-redux-saga-hoc';

export const ON_CHANGE = 'onChange';
export const ON_BLUR = 'onBlur';
export const VALUE = 'value';
export const ERROR = 'error';

export const SUBJECT_TYPES_OPTIONS = [
  'Physical',
  'Health',
  'Physical & Health',
];
export const QUESTION_TYPES_OPTIONS = [
  'multiple choice',
  'checklist',
  'objective',
  'match',
];

export const SUBJECT_TYPES_OPTIONS_DROPDOWN = SUBJECT_TYPES_OPTIONS.map(e => ({
  name: toCapitalize(e),
  id: e,
}));

export const QUESTION_TYPES_OPTIONS_DROPDOWN = QUESTION_TYPES_OPTIONS.map(
  e => ({
    name: toCapitalize(e),
    id: e,
  }),
);
