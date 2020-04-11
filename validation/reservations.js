const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateReservationInput(data) {
  let errors = {};
  data.totalDays = !isEmpty(data.totalDays) ? data.totalDays : 0;
  data.totalPrice = !isEmpty(data.totalPrice) ? data.totalPrice : 0;
  data.firstDate = !isEmpty(data.firstDate) ? data.firstDate : "";
  data.endDate = !isEmpty(data.endDate) ? data.endDate : "";
  data.firstTime = !isEmpty(data.firstTime) ? data.firstTime : "";
  data.endTime = !isEmpty(data.endTime) ? data.endTime : "";

  if (Validator.isEmpty(data.client.email)) {
    errors.email = "Email field is required";
  }
  if (Validator.isEmpty(data.client.adress)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(data.client.adress)) {
    errors.adress = "adress field is required";
  }

  if (Validator.isEmpty(data.client.state)) {
    errors.state = "state field is required";
  }

  if (Validator.isEmpty(data.totalDays)) {
    errors.totalDays = "totalDays field is required";
  }

  if (Validator.isEmpty(data.totalPrice)) {
    errors.totalPrice = "totalPrice field is required";
  }

  if (Validator.isEmpty(data.firstDate)) {
    errors.firstDate = "firstDate field is required";
  }

  if (Validator.isEmpty(data.endDate)) {
    errors.endDate = "endDate field is required";
  }

  if (Validator.isEmpty(data.firstTime)) {
    errors.firstTime = "firstTime field is required";
  }

  if (Validator.isEmpty(data.endTime)) {
    errors.endTime = "endTime field is required";
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};
