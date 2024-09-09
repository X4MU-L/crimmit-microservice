import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';

export class HTTPAppAuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const bearerToken = ctx.getRequest<Request>().headers['authorization'];

    if (!bearerToken) return false;
    const tokenSplit = bearerToken.split(' ');
    if (tokenSplit.length !== 2) return false;
    console.log('switched');
    const [, token] = tokenSplit;

    return this.authService.send({ cmd: 'verify-token' }, { token }).pipe(
      switchMap(({ exp }) => {
        console.log('switched');
        if (!exp) return of(false);
        const TOKEN_EXP_MS = exp * 1000;
        return of(Date.now() < TOKEN_EXP_MS);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}
