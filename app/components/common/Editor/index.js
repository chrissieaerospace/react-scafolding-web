/* eslint-disable object-shorthand */
/* eslint-disable react/prop-types */
/* eslint-disable func-names */
import React, { useState } from 'react';
import { Editor as TinyEditor } from '@tinymce/tinymce-react';
import { useDashboardHoc } from 'Shared/hoc';

// import { generateTimeStamp } from 'react-boilerplate-redux-saga-hoc';
// import Axios from 'Shared/hoc/axios';
export default ({
  error,
  onChangeValue = () => {},
  onBlurInput = () => {},
  onLoadEnd = () => {},
  height = 600,
  initialValue: value,
  reset: Reset,
}) => {
  const { axios } = useDashboardHoc();

  const [isLoaded, setIsLoaded] = useState(false);
  const [initialValue] = useState(value);
  const [reset, setReset] = useState(Reset);
  React.useEffect(() => {
    setReset(Reset);
  }, [Reset]);
  return (
    <div
      className="editor"
      style={{
        height: `${height}px`,
        backgroundColor: isLoaded ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        border: error ? 'solid 1px red' : 'none',
      }}
    >
      <TinyEditor
        initialValue={initialValue || ''}
        key={reset}
        // key={loader}
        // initialValue={(initialValue || '')
        //   .replace(
        //     /https:\/\/www.outlookbusiness.com\/public\/uploads/gi,
        //     'https://outlook-media.s3-ap-southeast-1.amazonaws.com',
        //   )
        //   .replace(
        //     /src="\/public\/uploads/gi,
        //     'src="https://outlook-media.s3-ap-southeast-1.amazonaws.com',
        //   )
        //   .replace(/title="/gi, 'alt="')}
        apiKey="59s3vbmj46p9fvp5twlrdi7zq9nowaptv1qppo6x2m0nmdst"
        onLoadContent={() => {
          setIsLoaded(true);
          onLoadEnd();
        }}
        init={{
          // plugins:
          //   'print preview powerpaste casechange importcss  searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars  emoticons advtable',
          plugins:
            'print preview   importcss  searchreplace autolink autosave save directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists  wordcount   imagetools textpattern noneditable help    charmap   quickbars  emoticons ',
          // tinydrive_token_provider:
          //   'URL_TO_YOUR_TOKEN_PROVIDER',
          // tinydrive_dropbox_app_key: 'YOUR_DROPBOX_APP_KEY',
          // tinydrive_google_drive_key: 'YOUR_GOOGLE_DRIVE_KEY',
          // tinydrive_google_drive_client_id:
          //   'YOUR_GOOGLE_DRIVE_CLIENT_ID',
          // mobile: {
          //   plugins:
          //     'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable',
          // },
          menu: {
            tc: {
              title: 'Comments',
              items: 'addcomment showcomments deleteallconversations',
            },
          },
          deprecation_warnings: false,
          menubar: 'file edit view insert format tools table tc help',
          toolbar:
            'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
          autosave_ask_before_unload: false,
          autosave_interval: '30s',
          autosave_prefix: '{query}',
          file_picker_types: 'image',
          autosave_restore_when_empty: false,
          autosave_retention: '2m',
          image_advtab: true,
          imagetools_toolbar: 'imageoptions format',
          images_upload_handler: function(blobInfo, success, failure) {
            // console.log(blobInfo);
            const fileReader = new FileReader();
            fileReader.onload = fileLoadedEvent => {
              const base64 = fileLoadedEvent.target.result;
              // debugger;
              const fileInfo = blobInfo.blob();
              const isLtEq5M = fileInfo.size / 1024 / 1024 <= 5;
              const isJpgOrPng =
                fileInfo.type === 'image/jpeg' || fileInfo.type === 'image/png';
              if (!isJpgOrPng) {
                failure('You can only upload JPG/PNG file!');
              } else if (!isLtEq5M) {
                failure('Image must smaller than 2MB!');
              } else {
                axios
                  .post(
                    'https://student-api.cartoonmango.com/api/upload/attachments',
                    {
                      image: base64.split(',')[1],
                      image_ext: fileInfo.type.split('/')[1],
                      type: 'content',
                    },
                  )
                  .then(({ data: { data: { url = '' } = {} } = {} }) => {
                    success(url);
                  })
                  .catch(() => {
                    failure('Error while uploading image');
                  });
              }
              // // TODO
              // success('https://fakeimg.pl/300/');
            };
            fileReader.readAsDataURL(blobInfo.blob());
          },
          content_css: '//www.tiny.cloud/css/codepen.min.css',
          link_list: [
            // {
            //   title: 'My page 1',
            //   value: 'http://www.tinymce.com',
            // },
            // {
            //   title: 'My page 2',
            //   value: 'http://www.moxiecode.com',
            // },
          ],
          // image_list: [
          //   // {
          //   //   title: 'My page 1',
          //   //   value: 'http://www.tinymce.com',
          //   // },
          //   // {
          //   //   title: 'My page 2',
          //   //   value: 'http://www.moxiecode.com',
          //   // },
          // ],
          image_class_list: [
            { title: 'None', value: '' },
            { title: 'Float Left', value: 'imageFloatLeft' },
            { title: 'Float Right', value: 'imageFloatRight' },
          ],
          importcss_append: true,
          style_formats: [
            {
              title: 'Image Left',
              selector: 'img',
              styles: {
                float: 'left',
                margin: '0 5px 0 5px',
              },
            },
            {
              title: 'Image Right',
              selector: 'img',
              styles: {
                float: 'right',
                margin: '0 0px 0 5px',
              },
            },
          ],
          // height: 400,
          templates: [
            {
              title: 'New Table',
              description: 'creates a new table',
              content:
                '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
            },
            {
              title: 'Starting my story',
              description: 'A cure for writers block',
              content: 'Once upon a time...',
            },
            {
              title: 'New list with dates',
              description: 'New List with dates',
              content:
                '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
            },
          ],
          template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
          height,
          min_height: height,
          max_height: height,
          image_caption: true,
          quickbars_selection_toolbar:
            'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          noneditable_noneditable_class: 'mceNonEditable',
          toolbar_mode: 'sliding',
          spellchecker_dialog: true,
          spellchecker_whitelist: ['Ephox', 'Moxiecode'],
          tinycomments_mode: 'embedded',
          // image_prepend_url: '',
          // images_upload_base_path: '/',
          content_style: '.mymention{ color: gray; }',
          contextmenu: 'link image  table configurepermanentpen',
          a11y_advanced_options: true,
          /*
      The following settings require more configuration than shown here.
      For information on configuring the mentions plugin, see:
      https://www.tiny.cloud/docs/plugins/mentions/.
      */
          mentions_selector: '.mymention',
          // file_picker_callback: function(
          //   callback,
          //   value,
          //   meta,
          // ) {
          //   debugger;
          //   // Provide file and text for the link dialog
          //   if (meta.filetype == 'file') {
          //     callback('mypage.html', { text: 'My text' });
          //   }

          //   // Provide image and alt text for the image dialog
          //   if (meta.filetype == 'image') {
          //     callback('myimage.jpg', { alt: 'My alt text' });
          //   }

          //   // Provide alternative source and posted for the media dialog
          //   if (meta.filetype == 'media') {
          //     callback('movie.mp4', {
          //       source2: 'alt.ogg',
          //       poster: 'image.jpg',
          //     });
          //   }
          // },
        }}
        onBlur={onBlurInput}
        onEditorChange={e => {
          onChangeValue({
            key: 'body',
            value: (e || '').replace(/alt="/gi, 'title="'),
          });
        }}
      />
      {error ? <span style={{ color: 'red' }}>{error}</span> : null}
    </div>
  );
};
