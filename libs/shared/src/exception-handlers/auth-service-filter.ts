import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { Response } from 'express';
@Catch(RpcException, HttpException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const rmqContext = ctx.getContext<RmqContext>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const message = exception.getResponse
        ? exception.getResponse()
        : exception.message;

      // Log or process the error response
      console.error('HTTP Exception:', message);

      // Respond with error message over RabbitMQ (or nack the message)
      rmqContext.getChannelRef().nack(rmqContext.getMessage());
    } else {
      // Handle RPC Exception
      console.error('RPC Exception:', exception.message);

      // Acknowledge error and handle custom messaging
      rmqContext.getChannelRef().nack(rmqContext.getMessage());
    }
  }
}