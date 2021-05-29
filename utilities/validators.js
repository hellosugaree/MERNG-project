module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {};
  if ((/^\w{5,20}$/.test(username) === false)) {
   errors.username = 'Username must be between 5 and 20 characters and contain only letters, numbers, or underscores';
  } 
  const emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if (emailRegEx.test(email) === false) {
    errors.email = 'Please enter a valid e-mail address';
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_]).{8,20}$/;
  if (passwordRegex.test(password) === false) {
    errors.password = 'Password must be between 8 to 20 characters, and must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character !@#$%^&*_';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Password and confirm password must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 // data valid 
  };
}

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  
  if (password === '') {
    errors.password = 'Password must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
}

module.exports.validateCommentInput = (body) => {
  const errors = {};
  if (body.trim() === '') {
    errors.body = 'Body must not be empty'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
}

module.exports.validatePostInput = (title, body) => {
  const errors = {};
  if (title.trim() === '') {
    errors.title = 'Title must not be empty';
  }
  if (body.trim() === '') {
    errors.body = 'Body must not be empty';
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
}

module.exports.validateCatchInput = (species, fishingType, catchDate, catchLocation, catchLength) => {
  const errors = {};

  if (species.trim() === '') {
    errors.species = 'Please select a species or check "Unknown species"'
  }
  if (fishingType.trim() === '') {
    errors.fishingType = 'Please select fishing type'
  }
  if (catchDate.trim() === '') {
    errors.catchDate = 'Please select a catch date'
  }
  
  if (catchLength && typeof catchLength !== 'number'){
    errors.catchLength = 'Please enter a valid number for catch length'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}