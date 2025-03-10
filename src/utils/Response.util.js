function sendResponse({
  res, // Fix: Change `response` to `res`
  statusCode,
  success,
  message = null,
  data = null,
  error = null,
}) {
  message = message || (error ? error.message || error : null);
  const responsePayload = {
    statusCode,
    success,
    message,
    data,
  };
  return res.status(statusCode).json(responsePayload); // Fix: Use `res`
}

export default sendResponse;
