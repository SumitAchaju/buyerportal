import CustomError from "../errors/custom.error.js";

function globalErrorHandler(err: Error, req: Req, res: Res, next: Next) {
  if (err instanceof CustomError) {
    res.error(err.message, err.errorCode, err.serializeErrors());
    return;
  }
  res.error();
}

export default globalErrorHandler;
