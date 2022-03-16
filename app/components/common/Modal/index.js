/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import './styles.scss';
import closeIcon from '../../../assets/images/modal-close.png';
// import arrow from "../../../assets/images/back-arrow.png";

const Modal = ({
  children,
  onClose = () => {},
  noClose,
  classname = '',
  bodyClassName = '',
  isOpen = false,
  isScrollable = false,
  isMobile = false,
  rootClassName = '',
  title,
  style = {},
  hasBack = false,
  transparent,
  zIndex = 1000,
  titleStyle = {},
}) => {
  const customStyles = {
    content: {
      top: isScrollable ? 'initial' : '50%',
      left: '50%',
      right: 'initial',
      display: 'flex',
      bottom: '-50%',
      padding: isMobile ? '0px' : 'initial',
      marginBottom: isMobile ? '0px' : 'initial',
      transform: isScrollable ? 'translateX(-50%)' : 'translate(-50%, -50%)',
      background: 'initial',
      border: 'initial',
      overflow: 'initial',
      // eslint-disable-next-line no-dupe-keys
      padding: isMobile ? '' : '20px',
    },
    overlay: {
      backgroundColor: transparent
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(0, 0, 0, 0.7)',
      zIndex,
      overflow: 'scroll',
      marginBottom: '0px',
    },
  };
  return (
    <ReactModal
      isOpen={isOpen}
      style={customStyles}
      className={rootClassName}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      {/* // overlayClassName={overlayClassName || ''} */}
      <div
        className={`modalWrapper ${classname}`}
        style={transparent ? { backgroundColor: 'transparent' } : {}}
      >
        <div
          className="modalHeader"
          style={{
            justifyContent: hasBack && noClose ? 'flex-start' : 'space-between',
          }}
        >
          {/* {hasBack && (
            <div
              className="back-arrow"
              onClick={onClose}
              style={{
                ...style
              }}
            >
              <img src={arrow} alt="arrow" />
            </div>
          )} */}
          <div
            className="title"
            style={{
              margin: hasBack && noClose ? '0px auto' : '0px',
              ...titleStyle,
            }}
          >
            {title}
          </div>
          {!noClose && (
            <div
              className="closeIcon"
              onClick={onClose}
              style={{
                // padding: "10px",
                // zIndex: "10000",
                ...style,
              }}
            >
              <img src={closeIcon} alt="close" />
              {/* </div> */}
            </div>
          )}
        </div>
        <div className={`modalBody ${bodyClassName}`}>{children}</div>
      </div>
    </ReactModal>
  );
};
Modal.propTypes = {
  children: PropTypes.any.isRequired,
  noClose: PropTypes.bool,
  classname: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isScrollable: PropTypes.bool,
  isMobile: PropTypes.bool,
  rootClassName: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
};
export default Modal;
