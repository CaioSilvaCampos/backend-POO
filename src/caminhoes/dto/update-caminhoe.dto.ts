import { PartialType } from '@nestjs/mapped-types';
import { CreateCaminhoeDto } from './create-caminhoe.dto';

export class UpdateCaminhoeDto extends PartialType(CreateCaminhoeDto) {}
