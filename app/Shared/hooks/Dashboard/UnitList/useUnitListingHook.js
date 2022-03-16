import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import { batch } from 'react-redux';
import { notification } from 'antd';
import { useDashboardHoc, useQuery } from '../../../hoc';

export const useUnitListingHook = props => {
  const query = qs.parse(props.history.location.search.slice(1));
  const [selectGrade, setSelectGrade] = useState(+query.grade_id);
  const [unitId, setUnitId] = useState('');
  const [unitRemoveModal, setUnitRemoveModal] = useState(false);
  const [page, setPage] = useState(+query.page);

  const {
    reducerName,
    actions: {
      GET_GRADES_LIST_API_CALL,
      DELETE_UNITS_API_CALL,
      DELETE_UNITS_API_CANCEL,
      DELETE_LESSON_API_CALL,
      DELETE_LESSON_API_CANCEL,
      GET_GRADES_LIST_API_CANCEL,
      LIST_UNITS_API_CALL,
      LIST_UNITS_API_CANCEL,
    },
    reducerConstants: {
      LIST_UNITS_API,
      GET_GRADES_LIST_API,
      DELETE_UNITS_API,
      DELETE_LESSON_API,
    },
  } = useDashboardHoc();

  useEffect(() => {
    if (
      !Number.isNaN(+query.grade_id) &&
      Number.isNaN(+query.grade_id) !== selectGrade
    )
      setSelectGrade(+query.grade_id);
    else setSelectGrade(null);
  }, [query.grade_id]);

  useEffect(() => {
    if (!Number.isNaN(+query.page) && Number.isNaN(+query.page) !== page) {
      setPage(+query.page);
    } else setPage(1);
  }, [query.page]);
  // const valueRef = useRef({});

  React.useEffect(() => {
    if (selectGrade) {
      const minusPage = page - 1;
      const currentTotal = minusPage * 10;
      LIST_UNITS_API_CALL({
        request: {
          query: {
            grade_id: selectGrade ? Number(selectGrade) : null,
            skip: currentTotal,
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
        LIST_UNITS_API_CANCEL(ON_UNMOUNT);
        DELETE_UNITS_API_CANCEL(ON_UNMOUNT);
        DELETE_LESSON_API_CANCEL(ON_UNMOUNT);
      });
    };
  }, []);

  const onChangeGrade = val => {
    props.history.replace({
      pathname: '/unit-list',
      search: `?grade_id=${val}&page=${page}`,
    });
  };

  const onChangePage = pages => {
    setPage(pages);
    const minusPage = pages - 1;
    const currentTotal = minusPage * 10;
    const totalCount = unitList.data.count;
    if (currentTotal <= totalCount) {
      LIST_UNITS_API_CALL({
        request: {
          query: {
            grade_id: selectGrade ? Number(selectGrade) : null,
            skip: currentTotal,
            limit: 10,
          },
        },
      });
    }
    props.history.replace({
      pathname: '/unit-list',
      search: `?grade_id=${selectGrade}&&page=${pages}`,
    });
  };

  const onDeleteLessons = () => {
    DELETE_LESSON_API_CALL({
      task: {
        name: 'Delete-Handler',
        key: 'id',
        id: [unitId.id],
        subKey: ['units'],
        response: {
          data: {},
        },
      },
      updateDataReducerKey: LIST_UNITS_API,
      request: {
        params: {
          id: unitId.id,
        },
      },
      callback: {
        successCallback: ({ data } = {}) => {
          if (data.data.code === 200) {
            notification.success({
              message: 'Unit Deleted Successfully',
            });
            setUnitRemoveModal(false);
            props.history.push({
              pathname: '/unit-list',
              search: `?grade_id=${selectGrade}&&page=${page}`,
            });
          }
        },
        errorCallback: ({ isNetworkError, message }) => {
          if (isNetworkError || message)
            notification.error({
              message:
                typeof message === 'string' ? message : JSON.stringify(message),
            });
        },
      },
    });
  };

  const onDeleteUnits = () => {
    DELETE_UNITS_API_CALL({
      task: {
        name: 'Delete-Handler',
        key: 'id',
        id: [unitId.id],
        subKey: ['units'],
        response: {
          data: {},
        },
      },
      updateDataReducerKey: LIST_UNITS_API,
      request: {
        params: {
          id: unitId.id,
        },
      },
      callback: {
        successCallback: ({ data } = {}) => {
          if (data.data.code === 200) {
            notification.success({
              message: 'Unit Deleted Successfully',
            });
            setUnitRemoveModal(false);
          }
        },
        errorCallback: ({ isNetworkError, message }) => {
          if (isNetworkError || message)
            notification.error({
              message:
                typeof message === 'string' ? message : JSON.stringify(message),
            });
        },
      },
    });
  };

  const [unitList, gradeList] = useQuery(reducerName, [
    {
      key: LIST_UNITS_API,
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
      key: DELETE_UNITS_API,
      requiredKey: ['loader'],
      default: {},
    },
    {
      key: DELETE_LESSON_API,
      requiredKey: ['loader'],
      default: {},
    },
  ]);
  // console.log(unitList, 'list');
  return {
    unitList,
    gradeList,
    onChangeGrade,
    selectGrade,
    onDeleteUnits,
    onDeleteLessons,
    setUnitId,
    unitId,
    unitRemoveModal,
    setUnitRemoveModal,
    onChangePage,
    page,
  };
};
// const getPlatformBasedFieldValue = e =>
//   typeof e === 'object' ? e.target.value : e;
