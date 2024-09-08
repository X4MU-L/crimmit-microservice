import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class TOKENGuard extends AuthGuard('jwt-token') {}
