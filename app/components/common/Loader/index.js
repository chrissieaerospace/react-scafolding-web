/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/common/Modal';
import { Spin } from 'antd';
// import gifImage from '../../../assets/images/gif/loader.gif';
import './Loader.scss';

function Loader(props) {
  return (
    <>
      {props.isOpen && (
        <div
          className={props.transparent ? '' : 'loader'}
          style={{ marginTop: props.transparent ? 80 : '' }}
        >
          <div className="loaderImage">
            <Spin size="large" />
          </div>
        </div>
      )}
    </>
  );
}
export function ModalLoader(props) {
  return (
    <>
      {props.isOpen ? (
        <Modal isOpen noClose transparent>
          <div
            className={props.transparent ? 'loader' : 'loader'}
            style={{
              marginTop: props.transparent ? 80 : undefined,
              backgroundColor: 'transparent',
            }}
          >
            <div
              className="loaderImage"
              style={
                props.transparent ? { backgroundColor: 'transparent' } : {}
              }
            >
              <Spin size="large" />
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
Loader.propTypes = {
  isOpen: PropTypes.bool,
  transparent: PropTypes.bool,
};
export default Loader;
