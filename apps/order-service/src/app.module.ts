// product-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { CrimmitProductModule } from './orders/orders.module';

@Module({
  imports: [CrimmitProductModule],
})
export class AppModule {}
