/* eslint-disable no-underscore-dangle */
import { useEffect, useState, useRef, useCallback } from 'react';
import Qs from 'query-string';
import history from 'utils/history';
import { generateTimeStamp } from 'react-boilerplate-redux-saga-hoc/utils';
const OPTIONS = {
  arrayFormat: 'bracket',
};
export default ({ url = '', isReplaceRoute = true } = {}) => {
  let { search: searchQuery } = history.location;
  searchQuery = searchQuery.slice(1);
  const __parsedQuery = Qs.parse(searchQuery || '', OPTIONS);
  const [search, setSearch] = useState(__parsedQuery);
  const [lastUpdated, setLastUpdated] = useState();
  const ref = useRef({});
  ref.current.query = search;
  ref.current.selectedQuery = search;
  ref.current.setSearchQuery = setSearch;
  ref.current.lastUpdated = lastUpdated;

  useEffect(() => {
    ref.current.pathname = url || history.location.pathname;
    ref.current.appliedQuery = __parsedQuery;
  }, []);

  useEffect(() => {
    if (ref.current.initial) {
      const _parsedQuery = Qs.parse(searchQuery || '', OPTIONS);
      ref.current.search = _parsedQuery;
      setSearch(_parsedQuery);
      ref.current.appliedQuery = _parsedQuery;
      setLastUpdated(generateTimeStamp());
    } else ref.current.initial = true;
  }, [searchQuery]);

  const onSubmit = useCallback((_url, _searchQuery) => {
    const _query = _searchQuery || ref.current.selectedQuery || {};
    const _pathname = _url || url || history.location.pathname;
    ref.current.appliedQuery = _query;
    ref.current.pathname = _pathname;
    history[isReplaceRoute ? 'replace' : 'push']({
      path: _pathname,
      search: Qs.stringify(_query, OPTIONS),
      state: history.location.state,
    });
  }, []);

  const onSetQuery = useCallback((query, _url) => {
    onSubmit(_url, query);
  }, []);

  const onClearQuery = useCallback(() => {
    setSearch({});
  }, []);

  ref.current.onSubmit = onSubmit;
  ref.current.onSetQuery = onSetQuery;
  ref.current.activeQueryString = searchQuery;
  ref.current.onClearQuery = onClearQuery;
  ref.current.selectedQueryString = Qs.stringify(
    ref.current.selectedQuery || {},
    OPTIONS,
  );
  ref.current.disabled =
    ref.current.activeQueryString === ref.current.selectedQueryString;
  ref.current.isEqual =
    ref.current.activeQueryString === ref.current.selectedQueryString;

  return {
    query: search,
    setSearchQuery: setSearch,
    searchRef: ref.current,
    onSubmit,
    onSetQuery,
    lastUpdated,
    onClearQuery,
  };
};
