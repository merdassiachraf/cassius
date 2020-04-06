const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.role = !isEmpty(data.role) ? data.role : "";
  data.adress = !isEmpty(data.adress) ? data.adress : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.confirmEmail = !isEmpty(data.confirmEmail) ? data.confirmEmail : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.countryCode = !isEmpty(data.countryCode) ? data.countryCode : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isLength((data.name), { min: 5, max: 30 })) {
    errors.name = "Name must be between 5 and 30 charachters";
  }

  if (!Validator.isLength((data.phoneNumber), { min: 8, max: 30 })) {
    errors.phoneNumber = "Phone number must be between 5 and 30 charachters";
  }

  if (!Validator.isLength((data.password), { min: 8, max: 30 })) {
    errors.password = "Password must be between 6 and 30 charachters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.state)) {
    errors.state = "State field is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "Country field is required";
  }

  if (Validator.isEmpty(data.countryCode)) {
    errors.countryCode = "Country code field is required";
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "phoneNumber field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.role)) {
    errors.role = "Role field is required";
  }

  if (Validator.isEmpty(data.adress)) {
    errors.adress = "Adress field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalidate E-mail";
  }

  if (!Validator.equals(data.email, data.confirmEmail)) {
    errors.confirmEmail = "E-mails must match";
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
