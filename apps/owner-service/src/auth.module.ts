import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [SharedModule, AuthModule, UserModule],
})
export class AppModule {}
