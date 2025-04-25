import { Module } from '@nestjs/common';
import { RemessasService } from './remessas.service';
import { RemessasController } from './remessas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemessaEntity } from './entities/remessa.entity';
import { RotasModule } from 'src/rotas/rotas.module';
import { DistanceService } from '../rotas/createDistance.service';

@Module({
  imports:[TypeOrmModule.forFeature([RemessaEntity]),RotasModule],
  controllers: [RemessasController],
  providers: [RemessasService, DistanceService ],
})
export class RemessasModule {}
