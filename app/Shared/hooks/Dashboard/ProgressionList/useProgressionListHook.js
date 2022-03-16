import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import { batch } from 'react-redux';
import { notification } from 'antd';
import { useDashboardHoc, useQuery } from '../../../hoc';

export const useProgressionListHook = props => {
  const query = qs.parse(props.history.location.search.slice(1));
  const [selectGrade, setSelectGrade] = useState(+query.grade_id);
  const [progressionId, setprogressionId] = useState('');
  const [removeModal, setRemoveModal] = useState(false);
  const [page, setPage] = useState(+query.page);

  const {
    reducerName,
    actions: {
      GET_GRADES_LIST_API_CALL,
      DELETE_FACULTY_CONTENT_API_CALL,
      DELETE_FACULTY_CONTENT_API_CANCEL,
      GET_GRADES_LIST_API_CANCEL,
      LIST_FACULTY_CONTENT_API_CALL,
      LIST_FACULTY_CONTENT_API_CANCEL,
    },
    reducerConstants: {
      LIST_FACULTY_CONTENT_API,
      GET_GRADES_LIST_API,
      DELETE_FACULTY_CONTENT_API,
    },
  } = useDashboardHoc();

  useEffect(() => {
    if (!Number.isNaN(+query.grade_id)) setSelectGrade(+query.grade_id);
  }, [query.grade_id]);

  useEffect(() => {
    if (!Number.isNaN(+query.page)) {
      setPage(+query.page);
    } else setPage(1);
  }, [query.page]);
  // const valueRef = useRef({});

  React.useEffect(() => {
    if (selectGrade) {
      const minusPage = page - 1;
      const currentTotal = minusPage * 10;
      LIST_FACULTY_CONTENT_API_CALL({
        request: {
          query: {
            grade_id: selectGrade ? Number(selectGrade) : null,
            skip: currentTotal,
            content_type: props.route.contentType,
            limit: 10,
          },
        },
      });
    }
  }, [selectGrade]);

  React.useEffect(() => {
    GET_GRADES_LIST_API_CALL();
    return () => {
      batch(() => {
        GET_GRADES_LIST_API_CANCEL(ON_UNMOUNT);
        LIST_FACULTY_CONTENT_API_CANCEL(ON_UNMOUNT);
        DELETE_FACULTY_CONTENT_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);

  const onChangeGrade = val => {
    props.history.replace({
      pathname: props.route.path,
      search: `?grade_id=${val}&&page=${page}`,
    });
  };

  const onChangePage = pages => {
    setPage(pages);
    const minusPage = pages - 1;
    const currentTotal = minusPage * 10;
    const totalCount = progressionList.data.count;
    if (currentTotal <= totalCount) {
      LIST_FACULTY_CONTENT_API_CALL({
        request: {
          query: {
            grade_id: selectGrade ? Number(selectGrade) : null,
            skip: currentTotal,
            content_type: props.route.contentType,
            limit: 10,
          },
        },
      });
    }
    props.history.replace({
      pathname: props.route.path,
      search: `?grade_id=${selectGrade}&&page=${pages}`,
    });
  };

  const onDelete = () => {
    DELETE_FACULTY_CONTENT_API_CALL({
      task: {
        name: 'Delete-Handler',
        key: 'id',
        subKey: ['contents'],
        id: [progressionId],
        response: {
          data: {},
        },
      },
      updateDataReducerKey: LIST_FACULTY_CONTENT_API,
      request: {
        params: {
          id: progressionId,
        },
      },
      callback: {
        successCallback: ({ data } = {}) => {
          if (data.data.code === 200) {
            notification.success({
              message: 'Deleted Successfully',
            });
            setRemoveModal(false);
          }
        },
        errorCallback: ({ isNetworkError, message }) => {
          if (isNetworkError || message)
            notification.success({
              message:
                typeof message === 'string' ? message : JSON.stringify(message),
            });
        },
      },
    });
  };

  const [progressionList, gradeList] = useQuery(reducerName, [
    {
      key: LIST_FACULTY_CONTENT_API,
      requiredKey: ['loader', 'data'],
      default: {},
    },
    {
      key: GET_GRADES_LIST_API,
      requiredKey: ['loader', 'data'],
      initialLoaderState: true,
      default: [],
    },
    {
      key: DELETE_FACULTY_CONTENT_API,
      requiredKey: ['loader'],
      default: {},
    },
  ]);
  // console.log(progressionList, 'list');
  return {
    progressionList,
    gradeList,
    onChangeGrade,
    selectGrade,
    onDelete,
    setprogressionId,
    progressionId,
    removeModal,
    setRemoveModal,
    onChangePage,
    page,
  };
};
// const getPlatformBasedFieldValue = e =>
//   typeof e === 'object' ? e.target.value : e;
