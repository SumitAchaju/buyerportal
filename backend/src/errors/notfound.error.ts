import CustomError, { type ISerializeErrors } from "./custom.error.js";

class NotFoundError extends CustomError {
  errorCode = 404;
  errorType = "Not Found";

  constructor(
    public data: string,
    public errorLocation?: string,
  ) {
    super(`${data} not found`);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ISerializeErrors {
    return [
      {
        message: this.message,
        location: this.errorLocation || "Internal",
      },
    ];
  }
}

export default NotFoundError;
