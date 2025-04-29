import { PartialType } from '@nestjs/mapped-types';
import { CreateCaminhoesDto } from './create-caminhoe.dto';

export class UpdateCaminhoeDto extends PartialType(CreateCaminhoesDto) {}
