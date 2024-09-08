// product-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { CrimmitProductModule } from './products/crimmit-product.module';

@Module({
  imports: [CrimmitProductModule],
})
export class AppModule {}
