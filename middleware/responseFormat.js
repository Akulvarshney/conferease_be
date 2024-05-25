// Define the formatResponse function
const formatResponse = (res, status, data, message, statusCode = 200) => {
  return res.status(statusCode).json({ status, data, message, statusCode });
};

module.exports = formatResponse;
