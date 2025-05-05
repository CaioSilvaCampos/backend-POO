import { Module } from '@nestjs/common';
import { RotasService } from './rotas.service';
import { RotasController } from './rotas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RotaEntity } from './entities/rota.entity';
import { DistanceService } from 'src/rotas/createDistance.service';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';
import { CaminhoesModule } from 'src/caminhoes/caminhoes.module';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RotaEntity, CaminhaoEntity]), CaminhoesModule],
  controllers: [RotasController],
  providers: [RotasService, DistanceService],
  exports:[RotasService]
})
export class RotasModule {}
