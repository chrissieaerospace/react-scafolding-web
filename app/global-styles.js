import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .ant-pagination-item.ant-pagination-item-active{
    background: #1890ff;
    border-color: #1890ff;
  }

  span{
    line-height: 26px;
  }
  .ant-pagination-item a{
    border: 1px solid #d9d9d9 !important;
    border-radius: 5px !important;
  }

  .ant-pagination{
    margin-top: 27px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  .ant-picker-header{
    display: flex;
    padding: 0 8px;
    border-bottom: 1px solid #f0f0f0;
    height: 100%;
  }

  .ant-picker-header>button {
    min-width: 1.6em;
    font-size: 14px;
    width: auto;
  }

  .ant-picker-header-view {
    flex: auto;
    font-weight: 500;
    /* line-height: 40px; */
    /* height: auto; */
    text-align: center;
  }

  .ant-picker-header-view button {
    color: inherit;
    font-weight: inherit;
    height: auto;
  }

  .ant-picker-header-view button:not(:first-child) {
    margin-left: 8px;
    height: auto;
  }
  .ant-picker-decade-panel, .ant-picker-quarter-panel, .ant-picker-date-panel, .ant-picker-time-panel{
    width: auto;
  }

  .ant-table-cell .table-text{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-pagination-options-size-changer.ant-select {
    display: none !important;;
    width: auto;
}

  .ant-picker-year-panel {
    width: 280px;
  }
  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }
`;

export default GlobalStyle;
