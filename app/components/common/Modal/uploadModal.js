/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Button from 'components/common/Button';
import del from 'assets/images/del-icon.png';
import { Safe, typeOf } from 'react-boilerplate-redux-saga-hoc/utils';
import {
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Upload, notification } from 'antd';
import { useDashboardHoc } from 'Shared/hoc';
import Modal from '.';

const { Dragger } = Upload;
const NotificationMessage = message => ({
  message,
  style: {
    zIndex: 200,
  },
});

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// async function asyncGetBase64(img) {
//   return new Promise(resolve => {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => resolve(reader.result));
//     reader.readAsDataURL(img);
//   });
// }

export default ({
  onClose,
  isOpen,
  imageArray = [],
  isMultiple = false,
  //   onChange = () => {},
  //   onError = () => {},
  onSubmit = () => {},
}) => {
  const { axios } = useDashboardHoc();
  const [image, setImage] = useState(imageArray);
  const [isLoading, setIsLoading] = useState(false);
  //   const handleChange = useCallback(info => {
  //     if (info.file.status === 'uploading') {
  //       setIsLoading(true);
  //       return;
  //     }
  //     console.log(info, info.file.status, info.file.originFileObj);
  //     if (info.file.status === 'done') {
  //       getBase64(info.file.originFileObj, imageUrl => {
  //         setImage(_image => _image.concat([imageUrl]));
  //       });
  //       onChange(info);
  //       //   setIsLoading(false);
  //       // Get this url from response in real world.
  //     } else if (info.file.status === 'error') {
  //       console.log(info);
  //       getBase64(info.file.originFileObj, imageUrl => {
  //         console.log(imageUrl);
  //         setImage(_image => (isMultiple ? _image : []).concat([imageUrl]));
  //       });
  //       onError(info);
  //       //   setIsLoading(false);
  //     }
  //   }, []);

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error(
        NotificationMessage('You can only upload JPG/PNG file!'),
      );
    }
    const isLtEq5M = file.size / 1024 / 1024 <= 5;
    if (!isLtEq5M) {
      notification.error(NotificationMessage('Image must smaller than 2MB!'));
    }

    if (isJpgOrPng && isLtEq5M) {
      setIsLoading(true);
      getBase64(file, async base64 => {
        try {
          const data = await axios.post(
            'https://student-api.cartoonmango.com/api/upload/attachments',
            {
              image: base64.split(',')[1],
              image_ext: file.type.split('/')[1],
              type: 'content',
            },
          );
          if (Safe(data, '.data.data.url'))
            setImage(_image =>
              (isMultiple ? _image : []).concat([
                { base64, url: Safe(data, '.data.data.url') },
              ]),
            );
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      });
    }
    return false;
  }

  console.log(
    image,
    image.map(e => (typeOf(e) === 'object' ? e.url : e || '')),
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Template">
      <div className="value-text">
        You can now Download template to upload as bulk
      </div>

      <div>
        <Button type="hyperlink" buttontxt="Download CSV" />
      </div>
      <Dragger
        name="file"
        // action="https://student-api.cartoonmango.com/api/upload/attachments"
        // action={async file => {
        //   console.log(file);

        // }}
        // data={async file => {
        //   console.log(file);
        //   setIsLoading(true);
        //   const base64 = await asyncGetBase64(file);
        //   return {
        //     image: 'base64',
        //     image_ext: file.type,
        //     type: base64,
        //   };
        // }}
        // accept="application/json"
        // headers={{
        //   'Content-Type': 'application/json',
        //   Authorization: axios.defaults.headers.common.Authorization,
        // }}
        disabled={isLoading}
        beforeUpload={beforeUpload}
        onDrop={e => console.log(e, 'onDrop')}
        // onChange={handleChange}
        progress={e => console.log(e, 'onProgress')}
        multiple={isMultiple}
        // isImageUrl={e => console.log(e, 'isImageUrl')}
      >
        <p className="ant-upload-drag-icon">
          {isLoading ? (
            <LoadingOutlined size={20} color="#458dff" />
          ) : (
            <InboxOutlined />
          )}
        </p>

        {!isLoading && [
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>,
          <p className="ant-upload-hint">Maximum file size 5MB</p>,
        ]}
      </Dragger>

      <div style={{ display: 'flex' }}>
        {image.map((_image = {}, i) => (
          <div
            className="flex-center input-image"
            style={{
              marginTop: '10px',
              border: '2px dotted rgba(232, 232, 232,1)',
              height: '100px',
              width: '100px',
              // opacity: 0.3,
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            <div
              className="input-image-upload"
              style={{ height: '100px', width: '100px' }}
              onClick={() => {
                setImage(_image => {
                  const __image = _image.slice();
                  __image.splice(i, 1);
                  return __image;
                });
              }}
            >
              <div
                style={{
                  height: '25px',
                  width: '25px',
                  // margin-right: 20px;
                  cursor: 'pointer',
                }}
              >
                <img srcSet={del} alt="" />
              </div>
            </div>
            <img
              srcSet={
                typeOf(_image) === 'object' ? _image.base64 : _image || ''
              }
              alt=""
              style={{ height: '100%' }}
            />
          </div>
        ))}
        <Upload
          name="file"
          headers={{
            Authorization: axios.defaults.headers.common.Authorization,
          }}
          //   action="https://student-api.cartoonmango.com/api/upload/attachments"
          disabled={isLoading}
          beforeUpload={beforeUpload}
          //   onDrop={e => console.log(e, 'onDrop')}
          //   onChange={handleChange}
          //   progress={e => console.log(e, 'onProgress')}
          multiple={isMultiple}
          // isImageUrl={e => console.log(e, 'isImageUrl')}
        >
          <div
            className="flex-center"
            style={{
              marginTop: '10px',
              border: '2px dotted gray',
              height: '100px',
              width: '100px',
              opacity: 0.3,
              cursor: 'pointer',
            }}
          >
            {isLoading ? (
              <LoadingOutlined size={10} color="#458dff" />
            ) : (
              <PlusOutlined />
            )}
          </div>
        </Upload>
      </div>

      <div className="footer-btn-wrapper">
        <div>
          <Button
            type="secondary"
            buttontxt="Cancel"
            style={{ width: 160, marginRight: 16 }}
            onClick={onClose}
          />
        </div>
        <div>
          <Button
            type="primary"
            buttontxt="Add"
            disabled={isLoading}
            onClick={() =>
              onSubmit(
                image.map(e => (typeOf(e) === 'object' ? e.url : e || '')),
              )
            }
            style={{ width: 160 }}
          />
        </div>
      </div>
    </Modal>
  );
};
