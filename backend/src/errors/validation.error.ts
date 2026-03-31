import CustomError, { type ISerializeErrors } from "./custom.error.js";

class ValidationError extends CustomError {
  errorCode = 422;
  errorType = "ValidationError";
  constructor(
    message: string,
    public errors: ISerializeErrors,
  ) {
    super(message);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  serializeErrors(): ISerializeErrors {
    return this.errors;
  }
}

export default ValidationError;
