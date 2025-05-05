import { PartialType } from '@nestjs/mapped-types';
import { CreateCaminhoesDto } from './create-caminhoe.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { statusCaminhao } from '../enum/statusCaminho.enum';

export class UpdateCaminhoeDto {
    @IsOptional()
    @IsString()
    cor?: string;

    @IsOptional()
    @IsEnum(statusCaminhao)
    status?: statusCaminhao;

    @IsOptional()
    @IsString()
    idMotorista?: string;  

    
    @IsOptional()
    @IsNumber()
    capacidadeDisponivel?:number
}
