import { Response } from 'express';

export interface ApiResponsePayload<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
  errors?: any;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message: string = 'Request successful',
    statusCode: number = 200,
    meta?: any
  ) {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    errors?: any
  ) {
    const payload: ApiResponsePayload<null> = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(payload);
  }
}
