import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { ON_UNMOUNT } from 'Shared/hoc/Authentication';
import { batch } from 'react-redux';
import { useDashboardHoc, useQuery } from '../../../hoc';

export const useLessonListingHook = props => {
  const [selectGrade, setSelectGrade] = useState(null);
  const [unitId, setUnitId] = useState('');
  const [unitRemoveModal, setUnitRemoveModal] = useState(false);

  // console.log(unitId, 'unit ....id..');
  const {
    reducerName,
    actions: {
      GET_GRADES_LIST_API_CALL,
      DELETE_UNITS_API_CALL,
      DELETE_UNITS_API_CANCEL,
      GET_GRADES_LIST_API_CANCEL,
      LIST_UNITS_API_CALL,
      LIST_UNITS_API_CANCEL,
    },
    reducerConstants: { LIST_UNITS_API, GET_GRADES_LIST_API, DELETE_UNITS_API },
  } = useDashboardHoc();
  const query = qs.parse(props.history.location.search.slice(1));

  useEffect(() => {
    if (query.grade_id) setSelectGrade(query.grade_id);
  }, [query.grade_id]);

  // const valueRef = useRef({});

  React.useEffect(() => {
    if (selectGrade) {
      props.history.replace({
        pathname: '/unit-list',
        search: `?grade_id=${selectGrade}`,
      });
      LIST_UNITS_API_CALL({
        request: {
          query: {
            grade_id: selectGrade ? Number(selectGrade) : null,
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
      });
    };
  }, []);

  const onChangeGrade = val => {
    setSelectGrade(val);
    LIST_UNITS_API_CALL({
      request: {
        query: {
          grade_id: selectGrade ? Number(selectGrade) : null,
        },
      },
    });
  };

  const onDeleteUnits = () => {
    DELETE_UNITS_API_CALL({
      request: {
        params: {
          id: unitId,
        },
      },
    });
    LIST_UNITS_API_CALL({
      request: {
        query: {
          grade_id: selectGrade ? Number(selectGrade) : null,
        },
      },
    });
    setUnitRemoveModal(false);
  };

  const [unitList, gradeList] = useQuery(reducerName, [
    {
      key: LIST_UNITS_API,
      requiredKey: ['loader', 'data'],
    },
    {
      key: GET_GRADES_LIST_API,
      requiredKey: ['loader', 'data'],
      initialLoaderState: true,
    },
    {
      key: DELETE_UNITS_API,
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
    setUnitId,
    unitId,
    unitRemoveModal,
    setUnitRemoveModal,
  };
};
// const getPlatformBasedFieldValue = e =>
//   typeof e === 'object' ? e.target.value : e;
