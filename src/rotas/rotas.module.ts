import { Module } from '@nestjs/common';
import { RotasService } from './rotas.service';
import { RotasController } from './rotas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RotaEntity } from './entities/rota.entity';
import { DistanceService } from 'src/external/distance/distance.service';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';
import { CaminhoesModule } from 'src/caminhoes/caminhoes.module';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';
import { DistanceModule } from 'src/external/distance/distance.module';

@Module({
  imports:[TypeOrmModule.forFeature([RotaEntity, CaminhaoEntity]), CaminhoesModule, DistanceModule],
  controllers: [RotasController],
  providers: [RotasService],
  exports:[RotasService]
})
export class RotasModule {}
