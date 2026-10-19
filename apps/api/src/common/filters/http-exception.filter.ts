import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Response, Request } from 'express';
import { randomUUID } from 'crypto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) || `req_${randomUUID()}`;
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Đã có lỗi xảy ra từ hệ thống. Vui lòng thử lại sau.';
    let fieldErrors: Record<string, string[]> | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as any;
        message = resObj.message || message;
        code = resObj.code || this.mapStatusToCode(status);

        if (Array.isArray(resObj.message)) {
          // Class-validator error messages array
          fieldErrors = {};
          resObj.message.forEach((msg: string) => {
            const field = msg.split(' ')[0] || 'general';
            if (!fieldErrors![field]) fieldErrors![field] = [];
            fieldErrors![field].push(msg);
          });
          message = 'Dữ liệu đầu vào không hợp lệ.';
          code = 'VALIDATION_FAILED';
        }
      }
    } else if (exception instanceof Error) {
      // Do not expose database, filesystem, or stack details to clients.
      console.error(`[${requestId}] Unhandled API error`, exception);
    }

    response.status(status).json({
      code,
      message,
      fieldErrors,
      requestId,
      timestamp
    });
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN_ACCESS';
      case HttpStatus.NOT_FOUND:
        return 'RESOURCE_NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMIT_EXCEEDED';
      default:
        return 'HTTP_ERROR';
    }
  }
}
