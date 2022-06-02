import { StatusCodes } from "http-status-codes";

import { errorsMessages } from "./messages";

class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(
    error: keyof typeof errorsMessages | Error,
    statusCode: keyof typeof StatusCodes = "BAD_REQUEST",
  ) {
    if (error instanceof Error) {
      this.message = errorsMessages["error_exception"] + error?.message;
    } else {
      this.message = errorsMessages[error];
    }
    this.statusCode = StatusCodes[statusCode];
  }
}

export { AppError };
