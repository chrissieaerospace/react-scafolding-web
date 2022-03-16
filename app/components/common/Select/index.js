/* eslint-disable no-nested-ternary */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import './styles.scss';
import arrow from '../../../assets/images/down-arrow.png';
// import "../../styles/stylesheet.scss";

const { Option } = Select;

const SelectComponent = ({
  title,
  varWidth,
  varHeight,
  filterOptions,
  placeholder,
  type2,
  handleChange,
  refer,
  name,
  error,
  onScroll,
  onSearch,
  disabled,
  search,
  onSelect,
  mode,
  defaultValue,
  notFoundContent,
  keyName,
  keyId,
  valueKey,
  onChangeDate,
  isDatePicker,
  value,
  isTimePicker,
  dateOptions = {},
}) => (
  <div
    style={{
      flexDirection: type2 ? 'row' : 'column',
      width: '100%',
    }}
  >
    {title ? (
      <div className="selectTitle" style={{ paddingBottom: type2 ? 0 : 10 }}>
        {title}
      </div>
    ) : null}
    {isDatePicker ? (
      <div
        style={{
          width: '100%',
        }}
      >
        <DatePicker
          onChange={onChangeDate}
          style={{
            width: '100%',
            height: '45px',
            borderRadius: '10px',
            border: error ? '1px solid red' : undefined,
          }}
          {...dateOptions}
        />
      </div>
    ) : isTimePicker ? (
      <div
        style={{
          width: '100%',
        }}
      >
        <TimePicker
          onChange={onChangeDate}
          style={{
            width: '100%',
            height: '45px',
            borderRadius: '10px',
            border: error ? '1px solid red' : undefined,
          }}
          {...dateOptions}
        />
      </div>
    ) : (
      <Select
        suffixIcon={
          <div style={{ width: 11, height: 7 }}>
            <img
              src={arrow}
              alt="arrow"
              style={{ height: '100%', width: '100%', objectFit: 'contain' }}
            />
          </div>
        }
        placeholder={placeholder}
        style={{
          width: varWidth ? varWidth : '100%',
          height: varHeight ? varHeight : 46,
          fontWeight: type2 ? 500 : 400,
          border: error ? '1px solid red' : '1px solid rgb(210, 210, 210)',
          borderRadius: 8,
        }}
        mode={mode}
        // labelInValue
        // value={value}
        filterOption={search && false}
        onChange={val => {
          if (handleChange) handleChange(val, name);

          if (onSelect) onSelect(val, filterOptions);
        }}
        notFoundContent={notFoundContent}
        showSearch={search && true}
        onPopupScroll={onScroll}
        onSearch={val => onSearch(val, name)}
        getPopupContainer={trigger => trigger.parentNode}
        disabled={disabled}
        defaultValue={defaultValue}
        ref={refer}
        value={value}
        showAction={['focus', 'click']}
      >
        {filterOptions &&
          filterOptions.length &&
          filterOptions.map(item => (
            <Option
              value={
                valueKey
                  ? item[valueKey]
                  : item.id ||
                    item.city_id ||
                    item.state_id ||
                    item.interest_id ||
                    item.institution_id
              }
              key={
                keyId
                  ? item[keyId]
                  : item.id ||
                    item.city_id ||
                    item.state_id ||
                    item.interest_id ||
                    item.institution_id
              }
            >
              {keyName
                ? item[keyName]
                : item.city_name ||
                  item.state_name ||
                  item.name ||
                  item.interest_name ||
                  item.institution_name}
            </Option>
          ))}
      </Select>
    )}
    {error ? <div className="error">{error}</div> : null}
  </div>
);
SelectComponent.propTypes = {
  type2: PropTypes.bool,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  varWidth: PropTypes.number,
  varHeight: PropTypes.number,
  filterOptions: PropTypes.array,
  handleChange: PropTypes.func,
  error: PropTypes.any,
};
export default SelectComponent;
