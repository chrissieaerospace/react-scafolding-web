/* eslint-disable react/prop-types */
import React from 'react';
import './styles.scss';
import empty from '../../../assets/images/empty.png';

const EmptyState = ({ message = '' }) => (
  <>
    <div className="empty-wrapper">
      <div className="image-wrapper">
        <img src={empty} alt="empty" />
      </div>
      <div className="empty-heading">{message || 'No data available'}</div>
    </div>
  </>
);

export default EmptyState;
