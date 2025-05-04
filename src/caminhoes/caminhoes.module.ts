import { Module } from '@nestjs/common';
import { CaminhoesService } from './caminhoes.service';
import { CaminhoesController } from './caminhoes.controller';

@Module({
  controllers: [CaminhoesController],
  providers: [CaminhoesService],
  exports:[CaminhoesService]
})
export class CaminhoesModule {}
