import type {
  Request as ExpReq,
  Response as ExpRes,
  NextFunction as ExpNext,
} from "express";
import type { IApiResponse } from "./src/types/response.ts";
import type { ISerializeErrors } from "./src/errors/custom.error.ts";
import type { Session, User } from "./generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Request {
      user: User;
      session: Session;
    }

    interface Response {
      json(data: IApiResponse<any>): this;
      success<T>(data: T, message?: string, statusCode?: number): void;
      error(
        message?: string,
        statusCode?: number,
        errors?: ISerializeErrors,
      ): void;
    }
  }

  type Req = ExpReq;
  type Res<T = any> = ExpRes<IApiResponse<T>>;
  type Next = ExpNext;
}

export {};
