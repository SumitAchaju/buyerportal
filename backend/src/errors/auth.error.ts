import CustomError, { type ISerializeErrors } from "./custom.error.js";

class UnAuthorizedError extends CustomError {
  errorCode = 401;
  errorType = "UnAuthorized";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }

  serializeErrors(): ISerializeErrors {
    return [
      {
        message: this.message,
        location: "Authorization",
      },
    ];
  }
}

class PermissionError extends CustomError {
  errorCode = 403;
  errorType = "Permission Denied";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, PermissionError.prototype);
  }

  serializeErrors(): ISerializeErrors {
    return [
      {
        message: this.message,
        location: "Permission",
      },
    ];
  }
}

export { UnAuthorizedError, PermissionError };
