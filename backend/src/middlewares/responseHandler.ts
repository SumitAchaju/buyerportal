export const responseHandler = (req: Req, res: Res, next: Next) => {
  res.success = function <T>(data: T, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.error = function (
    message = "Internal Server Error",
    statusCode = 500,
    errors = [
      {
        message,
        location: "Internal",
      },
    ],
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  };

  next();
};
