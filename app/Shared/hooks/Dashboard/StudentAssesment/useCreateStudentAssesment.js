/* eslint-disable camelcase */
/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
import { useRef, useEffect, useCallback, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { notification } from 'antd';
import {
  generateTimeStamp,
  ON_UNMOUNT,
} from 'react-boilerplate-redux-saga-hoc';
// import moment from 'moment';
import { useDashboardHoc, useQuery } from 'Shared/hoc';
import { useAssesmentDetailHook, useQuestionPreparingHook } from '.';
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(+startIndex, 1);
  result.splice(+endIndex, 0, removed);
  return result;
};
const NotificationMessage = message => ({
  message,
  style: {
    zIndex: 200,
  },
});
const ObjectiveOptionRef = {
  value: {
    optionRef: 'options',
  },
};

export const useCreateStudentAssesment = props => {
  const ref = useRef({});
  const {
    reducerName,
    actions: {
      CREATE_STUDENT_ASSESSMENT_POST_API_CALL,
      CREATE_STUDENT_ASSESSMENT_POST_API_CANCEL,
      UPDATE_STUDENT_ASSESSMENT_PUT_API_CALL,
      UPDATE_STUDENT_ASSESSMENT_PUT_API_CANCEL,
      CREATE_PEER_ASSESSMENT_POST_API_CALL,
      CREATE_PEER_ASSESSMENT_POST_API_CANCEL,
      UPDATE_PEER_ASSESSMENT_PUT_API_CALL,
      UPDATE_PEER_ASSESSMENT_PUT_API_CANCEL,
      GET_STUDENT_PEER_ASSESMENT_DETAIL_API_CALL,
      GET_STUDENT_PEER_ASSESMENT_DETAIL_API_CANCEL,
    },
    reducerConstants: {
      CREATE_STUDENT_ASSESSMENT_POST_API,
      UPDATE_STUDENT_ASSESSMENT_PUT_API,
      CREATE_PEER_ASSESSMENT_POST_API,
      UPDATE_PEER_ASSESSMENT_PUT_API,
      GET_STUDENT_PEER_ASSESMENT_DETAIL_API,
    },
  } = useDashboardHoc();

  useEffect(
    () => () => {
      CREATE_STUDENT_ASSESSMENT_POST_API_CANCEL(ON_UNMOUNT);
      UPDATE_STUDENT_ASSESSMENT_PUT_API_CANCEL(ON_UNMOUNT);
      CREATE_PEER_ASSESSMENT_POST_API_CANCEL(ON_UNMOUNT);
      UPDATE_PEER_ASSESSMENT_PUT_API_CANCEL(ON_UNMOUNT);
      GET_STUDENT_PEER_ASSESMENT_DETAIL_API_CANCEL(ON_UNMOUNT);
    },
    [],
  );

  const loader = useQuery(reducerName, [
    {
      key: CREATE_STUDENT_ASSESSMENT_POST_API,
      query: '.loader',
    },
    {
      key: UPDATE_STUDENT_ASSESSMENT_PUT_API,
      query: '.loader',
    },
    {
      key: CREATE_PEER_ASSESSMENT_POST_API,
      query: '.loader',
    },
    {
      key: UPDATE_PEER_ASSESSMENT_PUT_API,
      query: '.loader',
    },
    {
      key: GET_STUDENT_PEER_ASSESMENT_DETAIL_API,
      query: '.loader',
    },
  ]);
  // const { state: { data: lessonData = {} } = {} } = props.history.location;
  const {
    match: { path, params: { id } = {} },
  } = props;
  const isEdit = [
    '/edit-student-assesment/:id',
    '/edit-peer-assesment/:id',
  ].includes(path);
  const isPeerAssessment = [
    '/create-peer-assesment',
    '/edit-peer-assesment/:id',
  ].includes(path);
  const { ref: assesmentDetailHookRef } = useAssesmentDetailHook(props, {
    isPeerAssessment,
  });
  const {
    ref: questionPreparationHookRef,
    questionRef,
  } = useQuestionPreparingHook(props, {
    assesmentDetailHookRef,
    isPeerAssessment,
  });
  const [moveToValue, setMoveToValue] = useState({});
  useEffect(() => {
    if (isEdit)
      GET_STUDENT_PEER_ASSESMENT_DETAIL_API_CALL({
        request: {
          params: {
            id,
          },
        },
        callback: {
          successCallback: ({ data: { data } = {} }) => {
            assesmentDetailHookRef.setInitialFormData(data);
            questionPreparationHookRef.setInitialFormData(data);
          },
        },
      });
  }, []);
  useEffect(() => {
    if (
      ['multiple choice', 'checklist'].includes(
        assesmentDetailHookRef.values.question_type,
      )
    ) {
      const optionRefKey = generateTimeStamp();
      questionRef.resetForm({
        questions: [
          {
            value: {
              text: '',
              optionRef: optionRefKey,
            },
          },
        ],
        [optionRefKey]: [{}, {}, {}, {}],
      });
    } else if (assesmentDetailHookRef.values.question_type === 'objective') {
      questionRef.resetForm({
        questions: [
          cloneDeep(ObjectiveOptionRef),
          cloneDeep(ObjectiveOptionRef),
          cloneDeep(ObjectiveOptionRef),
          cloneDeep(ObjectiveOptionRef),
        ],
        options: [{}, {}],
      });
    } else if (assesmentDetailHookRef.values.question_type === 'match') {
      questionRef.resetForm({
        questions: [{}, {}, {}],
      });
    }
  }, [assesmentDetailHookRef.values.question_type]);

  const getRecursiveOptions = useCallback((_ref, _key) => {
    if (_key)
      return _ref[_key].map(e => ({
        value: e.value,
        options: getRecursiveOptions(_ref, e.value && e.value.optionRef),
      }));
    return undefined;
  }, []);

  const onKeyDown = useCallback((e, questionIndex) => {
    const value = +e.target.value;
    e.target.setAttribute('value', '');
    if (
      value > 0 &&
      value < (questionRef.formValue.questions || []).length + 1
    ) {
      setMoveToValue({
        lastUpdated: generateTimeStamp(),
      });
      questionPreparationHookRef.onChangeOrder(
        'questions',
        questionIndex,
        value - 1,
      );
    } else {
      notification.error({
        message: 'Invalid Value',
        style: {
          zIndex: 200,
        },
      });
    }
  }, []);

  const onDragEnd = useCallback(result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const _items = reorder(
      cloneDeep(questionRef.formValue.questions || []),
      result.source.index,
      result.destination.index,
    );

    questionRef.resetValue({
      questions: _items,
    });
  }, []);

  const onSubmitForm = useCallback(() => {
    const question = questionPreparationHookRef.onSubmitForm();
    const grade = assesmentDetailHookRef.onSubmitGradeOptionsForm();
    const detail = assesmentDetailHookRef.onSubmitDetailSelectionForm();
    const FormattedQuestions = question.payload.question.questions.map(
      ({ value }) => ({
        question: value,
        type: detail.payload.question_type,
        options: getRecursiveOptions(
          question.payload.question,
          value.optionRef,
        ),
      }),
    );
    let api_call = null;
    if (isPeerAssessment)
      api_call = isEdit
        ? UPDATE_PEER_ASSESSMENT_PUT_API_CALL
        : CREATE_PEER_ASSESSMENT_POST_API_CALL;
    else
      api_call = isEdit
        ? UPDATE_STUDENT_ASSESSMENT_PUT_API_CALL
        : CREATE_STUDENT_ASSESSMENT_POST_API_CALL;

    const payload = {
      questions: FormattedQuestions,
      title: question.payload.title,
      description: question.payload.description,
      ...detail.payload,
      ...grade.payload,
    };
    if (isPeerAssessment) {
      delete payload.unit_id;
      delete payload.lesson_id;
    }
    if (isEdit) delete payload.grade_id;
    api_call({
      request: {
        payload,
        params: {
          id,
        },
      },
      callback: {
        successCallback: () => {
          notification.success(
            NotificationMessage(
              `${isPeerAssessment ? 'Peer' : 'Student'} Assessment ${
                isEdit ? 'updated' : 'created'
              } successfully`,
            ),
          );
          // props.history.push(
          //   isPeerAssessment ? '/peer-assesment' : '/student-assesment',
          // );
          props.history.goBack();
        },
        errorCallback: ({ isNetworkError, message }) => {
          if (isNetworkError || message) {
            notification.error({
              message:
                typeof message === 'string' ? message : JSON.stringify(message),
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
  /* ================ Returns - start ================== */
  const RETURN_OBJECT = {
    loader,
    questionPreparationHookRef,
    assesmentDetailHookRef,
    isEdit,
    onSubmitForm,
    moveToValue,
    onKeyDown,
    setMoveToValue,
    onDragEnd,
    isPeerAssessment,
  };
  Object.entries(RETURN_OBJECT).forEach(([key, value]) => {
    ref.current[key] = value;
  });
  return {
    ...RETURN_OBJECT,
    ref: ref.current,
  };
};
