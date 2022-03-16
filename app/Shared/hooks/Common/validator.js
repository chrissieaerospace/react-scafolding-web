import { validateEmail } from '../../utils/utilFunctions';

function validate(
  value,
  fieldName,
  { optional: isOptional, minLength, isRequired } = {},
) {
  if ((isOptional || !isRequired) && !value) return '';
  if (value && minLength && value < minLength)
    return `Minimum ${minLength} characters is required`;
  switch (fieldName) {
    case 'password': {
      if (!value) {
        return 'This field is required';
      }
      return '';
    }
    case 'email': {
      if (!value) return 'Please enter your email';
      if (value && !validateEmail(value)) return 'Invalid email address';
      return '';
    }
    case 'name': {
      if (!value) return 'Please enter your name';
      // if (value && !validateEmail(value)) return 'Invalid email address';
      return '';
    }
    case 'mobileNumber': {
      if (!value) return 'Please enter 10 digit mobile number';
      if (value.length && value.length !== 10)
        return 'Mobile number should be 10 digits long';
      return '';
    }
    case 'about': {
      if (!value) return 'This field is required';
      // if (value && !validateEmail(value)) return 'Invalid email address';
      return '';
    }
    default:
      if (!value) {
        return 'This field is required';
      }
      return '';
  }
}

export default validate;
