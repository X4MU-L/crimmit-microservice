import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException, HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  //private readonly logger = new MyLoggerService(HttpExceptionFilter.name);
  catch(exception: RpcException | HttpException, host: ArgumentsHost) {
    console.log('exepetion');
    if (exception instanceof HttpException) {
      console.log('http errors', exception);
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        typeof exception.getResponse === 'function'
          ? exception.getResponse()
          : exception.message;

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
        message,
      });
    } else {
      const ctx = host.switchToRpc();
      const response = ctx.getContext<RmqContext>();
      // Acknowledge or reject the message as needed
      // Handle the exception and send a response back
      console.error(
        'An error occurred: here',
        exception.message,
        response.getMessage(),
      );
      response.getChannelRef().nack(response.getMessage());
    }
    //  this.logger.error(myResponseObj.response, HttpExceptionFilter.name);

    super.catch(exception, host);
  }
}
