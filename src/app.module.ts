import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from 'config/postgres.config.service';
import { RotasModule } from './rotas/rotas.module';
import { RemessasModule } from './remessas/remessas.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
 }),
 TypeOrmModule.forRootAsync({
  useClass: PostgresConfigService,
  inject: [PostgresConfigService]
 }),
 RotasModule,
 RemessasModule,
 CacheModule.register({isGlobal:true, ttl:10000})
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
