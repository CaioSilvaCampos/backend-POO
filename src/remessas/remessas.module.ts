import { Module } from '@nestjs/common';
import { RemessasService } from './remessas.service';
import { RemessasController } from './remessas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemessaEntity } from './entities/remessa.entity';
import { RotasModule } from 'src/rotas/rotas.module';
import { DistanceService } from '../rotas/createDistance.service';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';
import { CaminhoesModule } from 'src/caminhoes/caminhoes.module';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RemessaEntity, CaminhaoEntity]),RotasModule, CaminhoesModule],
  controllers: [RemessasController],
  providers: [RemessasService],
  exports:[RemessasService]
})
export class RemessasModule {}
