import { Module } from '@nestjs/common';
import { RotasService } from './rotas.service';
import { RotasController } from './rotas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RotaEntity } from './entities/rota.entity';
import { DistanceService } from 'src/rotas/createDistance.service';

@Module({
  imports:[TypeOrmModule.forFeature([RotaEntity])],
  controllers: [RotasController],
  providers: [RotasService, DistanceService],
  exports:[RotasService]
})
export class RotasModule {}
