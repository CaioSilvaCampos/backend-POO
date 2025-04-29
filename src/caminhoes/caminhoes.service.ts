import { Injectable } from '@nestjs/common';
import { CreateCaminhoesDto } from './dto/create-caminhoe.dto';
import { UpdateCaminhoeDto } from './dto/update-caminhoe.dto';

@Injectable()
export class CaminhoesService {
  create(createCaminhoeDto: CreateCaminhoesDto) {
    return 'This action adds a new caminhoe';
  }

  findAll() {
    return `This action returns all caminhoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caminhoe`;
  }

  update(id: number, updateCaminhoeDto: UpdateCaminhoeDto) {
    return `This action updates a #${id} caminhoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} caminhoe`;
  }
}
