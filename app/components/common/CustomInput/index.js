/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import upload from 'assets/images/upload-image.png';
import closeIcon from 'assets/images/close.png';
import UploadModal from 'components/common/Modal/uploadModal';
import './styles.scss';

const CustomInput = ({
  labeltext,
  placeholder,
  error,
  isTextArea,
  isImageInput,
  image,
  onImageUploaded,
  isQuestion,
  rows = 4,
  isImageUpload,
  ...restProps
}) => {
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [loader, setIsLoader] = React.useState(false);
  React.useEffect(() => {
    if (image) setIsLoader(true);
  }, [image]);
  return (
    <div className="input-wrapper">
      {labeltext && (
        <div className="input-label" style={{ marginLeft: '5px' }}>
          {labeltext}
        </div>
      )}
      {isImageInput || isImageUpload ? (
        <div
          style={{
            display: 'flex',
            flexDirection: isQuestion ? 'column-reverse' : 'row',
            justifyContent: 'center',
            border: '1px solid #e5e5e5',
            borderRadius: '10px',
            marginTop: '10px',
            width: isImageUpload ? '420px' : '100%',
          }}
        >
          <div
            className="flex-center input-image"
            style={{
              width: isQuestion ? '400px' : '35px',
              height: isQuestion ? '200px' : undefined,
              margin: '10px',
              background: 'rgb(229, 229, 229,0.5)',
              borderRadius: '5px',
              position: 'relative',
            }}
          >
            <div
              className="input-image-upload"
              onClick={() => {
                setShowUploadModal(true);
              }}
              style={{ flexDirection: 'column' }}
            >
              <img
                srcSet={upload}
                style={{
                  height: isQuestion ? '50px' : '15px',
                  width: isQuestion ? '50px' : '15px',
                  zIndex: 3,
                }}
                alt=""
              />

              {isQuestion && !image ? (
                <span style={{ marginTop: '10px', opacity: '0.5' }}>
                  Please click here to add image
                </span>
              ) : null}
            </div>
            {!image && (
              <div
                className="input-image-upload-placeholder"
                onClick={() => {
                  setShowUploadModal(true);
                }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <img
                  srcSet={upload}
                  style={{
                    height: isQuestion ? '50px' : '15px',
                    width: isQuestion ? '50px' : '15px',
                    zIndex: 3,
                  }}
                  alt=""
                />
                {isQuestion ? (
                  <span style={{ marginTop: '10px', opacity: '0.5' }}>
                    Please click here to add image
                  </span>
                ) : null}
              </div>
            )}
            {image && loader ? (
              <div
                className="image-loader"
                onClick={() => {
                  setShowUploadModal(true);
                }}
              >
                <LoadingOutlined size={20} color="#458dff" />
              </div>
            ) : null}
            {!!image && (
              <div
                className="input-image-close"
                onClick={() => {
                  onImageUploaded([]);
                }}
              >
                <img
                  srcSet={closeIcon}
                  style={{
                    height: isQuestion ? '25px' : '15px',
                    width: isQuestion ? '25px' : '15px',
                    zIndex: 3,
                  }}
                  alt=""
                />
              </div>
            )}

            {!!image && (
              <img
                srcSet={image}
                style={{
                  width: '100%',
                  height: isQuestion ? '100%' : '20px',
                  objectFit: 'contain',
                  zIndex: 2,
                }}
                alt=""
                onLoad={() => setIsLoader(false)}
                onError={() => setIsLoader(false)}
              />
            )}
          </div>
          {!isImageUpload && (
            <div style={{ width: '100%' }}>
              {isTextArea ? (
                <Input.TextArea
                  rows={2}
                  placeholder={placeholder}
                  style={{ outline: 'none', border: 'none' }}
                  {...restProps}
                />
              ) : (
                <Input
                  placeholder={placeholder}
                  style={{ outline: 'none', border: 'none' }}
                  {...restProps}
                />
              )}
            </div>
          )}
        </div>
      ) : isTextArea ? (
        <Input.TextArea rows={rows} placeholder={placeholder} {...restProps} />
      ) : (
        <Input placeholder={placeholder} {...restProps} />
      )}
      {error ? (
        <div
          className="input-label"
          style={{ color: 'red', marginTop: '5px', opacity: 0.7 }}
        >
          {error}
        </div>
      ) : null}
      {!!showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          isMultiple={false}
          imageArray={image ? [image] : []}
          onSubmit={e => {
            setShowUploadModal(false);
            if (onImageUploaded) onImageUploaded(e);
          }}
        />
      )}
    </div>
  );
};
CustomInput.propTypes = {
  labeltext: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
};
export default CustomInput;
