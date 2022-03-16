/* eslint-disable no-param-reassign */
import moment from 'moment';
import { numberReg, emailRegex, emptySpaceReg } from './regex';
// const timestamp = moment(dateFromDatabase, 'ddd MMM DD YYYY HH:mm:ss GMT Z').fromNow();

// const TIME_FORMAT = 'hh:mm A';
const DATE_FORMAT = 'MMM DD, YY';
const COMPLETE_DATE_FORMAT = 'DD MMM, YY';
const DATE_WITHOUT_YEAR_FORMAT = 'MMM DD';

export const trimStrings = (value = '', isNumber = false) => {
  if (value && String(value)) {
    const trimedString = String(value).trim();
    return isNumber ? Number(trimedString) : trimedString;
  }
  return value;
};

export function isValidNumber(value) {
  return numberReg.test(value && String(value).trim());
}

export function validateEmail(email) {
  return emailRegex.test(String(email).toLowerCase());
}

export function isEmptySpace(value) {
  return emptySpaceReg.test(value);
}

export const columnize = (items, rows) => {
  const toColumns = (table, item, iteration) => {
    const row = iteration % rows;

    table[row] = table[row] || [];
    table[row].push(item);

    return table;
  };

  return items.reduce(toColumns, []);
};

export const columnizeData = (inputArray = [], perChunk, isCheckKey = null) => {
  let formattedArray = inputArray;
  if (isCheckKey) {
    formattedArray = inputArray.filter(
      arr => arr[isCheckKey] && Object.keys(arr[isCheckKey]).length,
    );
  }

  const result = formattedArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return result;
};

export const pluralize = (count = 0, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const formatDate = (date, showFullDate = false) => {
  let formatedDate = null;
  if (date) {
    const momentDate = moment(date);
    const today = moment().startOf('day');
    const yesterday = moment()
      .subtract(1, 'days')
      .startOf('day');
    if (momentDate.isSame(today, 'd')) {
      formatedDate = moment(date).fromNow();
    } else if (momentDate.isSame(yesterday, 'd')) {
      // formatedDate = `Yesterday ${moment(date).format(TIME_FORMAT)}`;
      formatedDate = 'Yesterday';
    } else {
      formatedDate = moment(date).format(COMPLETE_DATE_FORMAT);
      const currentDate = moment();
      if (!showFullDate && momentDate.isSame(currentDate, 'year')) {
        formatedDate = moment(date).format(DATE_WITHOUT_YEAR_FORMAT);
      }
    }
  }

  return formatedDate;
};

export const formatDateWithGivenFormat = ({
  date,
  format = DATE_FORMAT,
  showTodayText = false,
}) => {
  let formatedDate = null;
  if (date) {
    const momentDate = moment(date); // fixed just for testing, use moment();
    const today = moment().startOf('day');

    if (showTodayText && momentDate.isSame(today, 'd')) {
      formatedDate = moment(date).fromNow();
    } else {
      formatedDate = moment(date).format(format || COMPLETE_DATE_FORMAT);
      const currentDate = moment();
      if (momentDate.isSame(currentDate, 'year')) {
        formatedDate = moment(date).format(DATE_WITHOUT_YEAR_FORMAT);
      }
    }
  }

  return formatedDate;
};

export const formatDuration = duration => {
  let formattedDuration = '';
  if (duration) {
    const hour = moment
      .utc(moment.duration(duration, 'seconds').asMilliseconds())
      .format('H');
    const minutes = moment
      .utc(moment.duration(duration, 'seconds').asMilliseconds())
      .format('mm');
    const seconds = moment
      .utc(moment.duration(duration, 'seconds').asMilliseconds())
      .format('ss');
    formattedDuration = moment
      .utc(moment.duration(duration, 'seconds').asMilliseconds())
      .format('mm:ss');

    if (hour && +hour > 0) {
      formattedDuration = `${hour}h ${minutes}m`;
    } else {
      formattedDuration = `${minutes}m`;
      if (seconds && +seconds > 0) {
        formattedDuration = `${formattedDuration} ${seconds}s`;
      }
    }
  }
  return formattedDuration;
};

export const formatTime = milliSecs => {
  let formattedTime = null;
  if (milliSecs) {
    if (+milliSecs < 3600000) {
      formattedTime = new Date(+milliSecs).toISOString().substr(14, 5);
    } else {
      formattedTime = new Date(+milliSecs).toISOString().substr(11, 8);
    }
  }
  return formattedTime;
};

export const formatLiveBlogDate = date => {
  let formatedTime = '';
  let formatedDate = '';
  let showDate = true;
  if (date) {
    const momentDate = moment(date);
    const today = moment().startOf('day');

    formatedTime = moment(date).format('hh:mm A');

    formatedDate = moment(date).format('DD MMM, YYYY');

    if (momentDate.isSame(today, 'd')) {
      showDate = false;
    }
  }
  return { formatedTime, formatedDate, showDate };
};

export function isHtml(text) {
  return /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(text);
}

export const numberFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(data => num >= data.value);
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};
