import type { IApiResponse } from "../types/response.js";

export type ISerializeErrors = Array<{ message: string; location: string }>;

abstract class CustomError extends Error {
  abstract errorCode: number;
  abstract errorType: string;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): ISerializeErrors;
}

export default CustomError;
