const formatSuccessResponse = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

const formatErrorResponse = (message = 'An error occurred', statusCode = 500) => {
  return {
    success: false,
    message,
    statusCode,
  };
};

module.exports = {
  formatSuccessResponse,
  formatErrorResponse,
}; 