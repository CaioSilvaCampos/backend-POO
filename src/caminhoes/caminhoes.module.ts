import { Module } from '@nestjs/common';
import { CaminhoesService } from './caminhoes.service';
import { CaminhoesController } from './caminhoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaminhaoEntity } from './entities/caminhoes.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CaminhaoEntity])],
  controllers: [CaminhoesController],
  providers: [CaminhoesService],
  exports:[CaminhoesService]
})
export class CaminhoesModule {}
