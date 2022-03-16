/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import UploadModal from 'components/common/Modal/uploadModal';

const UploadWrapper = ({
  onImageUploaded,
  children,
  image,
  isMultiple = false,
}) => {
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  return (
    <div>
      {children(setShowUploadModal)}
      {!!showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          isMultiple={isMultiple}
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

export default UploadWrapper;
