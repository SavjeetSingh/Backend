export const responseMiddleware = (_req, res, next) => {
  res.success = (data, statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      data,
    });
  };

  res.error = (message, statusCode = 500) => {
    res.status(statusCode).json({
      success: false,
      message,
    });
  };

  next();
};
