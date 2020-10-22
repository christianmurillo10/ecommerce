class ErrorHandler extends Error {
  statusCode = 500;
  message = "Something went wrong";
  errors = [];

  constructor(statusCode, errors) {
    super();
    switch (statusCode) {
      case 400:
        this.message = "Bad Request";
        break;
      case 401:
        this.message = "Anauthorized";
        break;
      case 403:
        this.message = "Forbidden";
        break;
      case 404:
        this.message = "Not Found";
        break;
      case 409:
        this.message = "Conflict";
        break;
      default:
        this.message = this.message;
    }

    this.statusCode = statusCode || this.statusCode;
    this.errors = errors || this.errors;
  }
}

const handleError = (err, res) => {
  const { statusCode, message, errors } = err;
  res.status(statusCode).send({
    status: "error",
    statusCode,
    message,
    errors,
  });
};

const handleSuccess = (res, obj) => {
  const { statusCode, message, result } = obj;
  res.status(statusCode).send({
    status: "success",
    statusCode: statusCode,
    message,
    result,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
  handleSuccess,
};
