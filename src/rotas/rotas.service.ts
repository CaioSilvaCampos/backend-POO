import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRotaDto } from './dto/create-rota.dto';
import { UpdateRotaDto } from './dto/update-rota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RotaEntity } from './entities/rota.entity';
import { Repository } from 'typeorm';
import { DistanceService } from 'src/rotas/createDistance.service';

@Injectable()
export class RotasService {
  constructor(
    @InjectRepository(RotaEntity)
    private readonly rotaRepository: Repository<RotaEntity>,
    private readonly distanceService: DistanceService,
  ){

  }
  async create(createRotaDto: CreateRotaDto) {
    const rota = new RotaEntity()

    const distanciaInfo = await this.distanceService.calcularDistancia(createRotaDto.origem, createRotaDto.destino);

    rota.destino = createRotaDto.destino
    rota.origem = createRotaDto.origem
    rota.status = createRotaDto.status
    rota.distanciaKm = distanciaInfo.distancia_km
    rota.duracao = distanciaInfo.duracao
    //rota.distanciaKm = createRotaDto.distanciaKm
    rota.idCaminhao ? createRotaDto.idCaminhao : null

    const rotaSalva = await this.rotaRepository.save(rota)

    return {
      message:'Rota salva com sucesso',
      rotaSalva
    }
  }

 async findAll() {
    const rotas = await this.rotaRepository.find()
    if(rotas.length == 0){
      return 'Não existem rotas cadastradas.'
    }
    else{
      return rotas
    } 
  }

  async findOne(id: string) {
    const rotaEncontrada = await this.rotaRepository.findOne({where:{
      id:id
    }})
    if(rotaEncontrada == null){
      throw new NotFoundException('Não existe nenhuma rota cadastrada com o id informado!')
    }
    else{
      return rotaEncontrada
    }
  }

  async update(id: string, updateRotaDto: UpdateRotaDto) {
    const rotaEncontrada = await this.findOne(id)
    let origem = updateRotaDto.origem ?? rotaEncontrada.origem;
    let destino = updateRotaDto.destino ?? rotaEncontrada.destino;
  
    if (updateRotaDto.origem || updateRotaDto.destino) {
      const distanciaInfo = await this.distanceService.calcularDistancia(origem, destino);
      rotaEncontrada.distanciaKm = distanciaInfo.distancia_km;
      rotaEncontrada.duracao = distanciaInfo.duracao;
    }
    Object.assign(rotaEncontrada, updateRotaDto)
    const rotaAtualizada = await this.rotaRepository.save(rotaEncontrada)
    return {
      message:"Rota atualizada com sucesso!",
      rotaAtualizada
    }
  }

  async remove(id: string) {
    const rota = await this.findOne(id); 
  
    const result = await this.rotaRepository.delete(id);
  
    if (result.affected && result.affected > 0) {
      return {
        mensagem: 'Rota excluída com sucesso',
        rota: rota,
      };
    } else {
      throw new NotFoundException('Rota não encontrada ou já foi excluída.');
    }
  }

  async atribuirCaminhao(id: string){
    
  }

  
}
