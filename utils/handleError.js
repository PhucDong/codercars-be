function handleError(message, statusCode) {
  const exception = new Error(message);
  exception.statusCode = statusCode;
  return exception;
}

module.exports = { handleError };
