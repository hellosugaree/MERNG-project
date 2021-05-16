module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {};
  if (username.trim() === '') {
   errors.username = 'Username must not be empty';
  } 
  if (email.trim() === '') {
    errors.username = 'Email must not be empty';
  } else {  // email not empty, now check for email address format validity
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (regEx.test(email) === false) {
      errors.email = 'Please enter a valid e-mail address';
    }
  }
  if (password.trim() === '') {
    errors.username = 'Username must not be empty';
  } 
  if (password === '') {
    errors.password = 'Password must not be empty';
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
