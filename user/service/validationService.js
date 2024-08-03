const namePattern = /^[^()<>]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\s-]{10,}$/;
const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const textPattern = /^[^<>]*$/;
const idPattern = /^[A-Za-z0-9-]+$/;

const validateNotEmpty = (value) => {
  if (!value.trim()) {
    return 'Field cannot be empty.';
  }
  return null;
};

const validateName = (name) => {
  const emptyError = validateNotEmpty(name);
  if (emptyError) {
    return emptyError;
  }
  if (!namePattern.test(name)) {
    return 'Names cannot contain parentheses or HTML tags.';
  }
  if (name.length <= 2) {
    return 'Name must be more than 3 characters.';
  }
  return null;
};

const validateEmail = (email) => {
  const emptyError = validateNotEmpty(email);
  if (emptyError) {
    return emptyError;
  }
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

const validatePhoneNumber = (phoneNo) => {
  const emptyError = validateNotEmpty(phoneNo);
  if (emptyError) {
    return emptyError;
  }
  if (!phonePattern.test(phoneNo)) {
    return 'Please enter a valid phone number.';
  }
  return null;
};

const validatePassword = (password) => {
  const emptyError = validateNotEmpty(password);
  if (emptyError) {
    return emptyError;
  }
  if (!passwordPattern.test(password)) {
    return 'Password must be at least 8 characters long and include at least one number, one uppercase letter, and one lowercase letter.';
  }
  return null;
};

const validateDescription = (description) => {
  const emptyError = validateNotEmpty(description);
  if (emptyError) {
    return emptyError;
  }
  if (description.length > 500) {
    return 'Description cannot exceed 500 characters.';
  }
  if (!textPattern.test(description)) {
    return 'Description cannot contain HTML tags.';
  }
  return null;
};

const validateFileUpload = (file) => {
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf)$/i;
  if (!allowedExtensions.exec(file.name)) {
    return 'Invalid file type. Only jpg, jpeg, png, gif, and pdf files are allowed.';
  }
  return null;
};

const validateIdNumber = (idNumber) => {
  const emptyError = validateNotEmpty(idNumber);
  if (emptyError) {
    return emptyError;
  }
  if (!idPattern.test(idNumber)) {
    return 'ID Number can only contain alphanumeric characters and hyphens.';
  }
  return null;
};

const validateInput = (name, value) => {
  let error = null;

  switch (name) {
    case 'first_name':
    case 'middle_name':
    case 'last_name':
      error = validateName(value);
      break;
    case 'email':
      error = validateEmail(value);
      break;
    case 'phone_no':
      error = validatePhoneNumber(value);
      break;
    case 'password':
      error = validatePassword(value);
      break;
    case 'description':
      error = validateDescription(value);
      break;
    case 'file_upload':
      error = validateFileUpload(value);
      break;
    case 'id_number':
      error = validateIdNumber(value);
      break;
    default:
      break;
  }

  return error ? { [name]: error } : {};
};

module.exports = {
  validateName,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateDescription,
  validateFileUpload,
  validateIdNumber,
  validateInput,
};
