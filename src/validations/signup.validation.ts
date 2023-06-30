import * as Yup from 'yup';
import {
  LOWERCASE_REGEX,
  NUMERIC_REGEX,
  UPPERCASE_REGEX,
} from '../utils/constants/regex.constants';

//fetch from firebase
const emailAddresses = ['test@gmail.com', 'test1@gmail.com', 'test2@gmail.com'];
const organizations = ['wcci', 'wcc'];

export const signupSchema = Yup.object({
  organization: Yup.string()
    .required('Organization is required')
    .notOneOf(organizations, 'Organization is already in use.'),
  email: Yup.string()
    .email('Email must be a valid email address.')
    .notOneOf(emailAddresses, 'Email address is already taken.')
    .required('Email is required.'),
  password: Yup.string()
    .required('Password is required')
    .matches(LOWERCASE_REGEX, 'At least one lowercase letter required.')
    .matches(UPPERCASE_REGEX, 'At least one uppercase letter required.')
    .matches(NUMERIC_REGEX, 'At least one number required.')
    .min(5, 'Minimum 5 characters required'),

  confirm_password: Yup.string()
    .required('Re-enter your password')
    .oneOf([Yup.ref('password')], 'Passwords must match.'),
});
