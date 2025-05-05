import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCaminhoesDto } from './dto/create-caminhoe.dto';
import { UpdateCaminhoeDto } from './dto/update-caminhoe.dto';
import { CaminhaoEntity } from './entities/caminhoes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { listaCaminhaoDTO } from './dto/lista-caminhao.dto';

@Injectable()
export class CaminhoesService {
  constructor(
    @InjectRepository(CaminhaoEntity)
    private readonly caminhaoRepository: Repository<CaminhaoEntity>){}
  
    async caminhaoExists(id:string){
      const caminhao = await this.caminhaoRepository.findOneBy({id})
      if(!caminhao){
        throw new NotFoundException('Esse caminhao nao existe')
      }
      else{
        return caminhao
      }
    }

    async create(createCaminhoesDto: CreateCaminhoesDto) { 
    const caminhao = new CaminhaoEntity()
    caminhao.capacidade = createCaminhoesDto.capacidade
    caminhao.placa = createCaminhoesDto.placa
    caminhao.status = createCaminhoesDto.status
    caminhao.idMotorista ? createCaminhoesDto.idMotorista : null
    caminhao.cor = createCaminhoesDto.cor
    caminhao.marca = createCaminhoesDto.marca
    caminhao.modelo = createCaminhoesDto.modelo
    caminhao.capacidadeDisponivel = caminhao.capacidade

    const caminhaoCriado = await this.caminhaoRepository.save(caminhao)
    return caminhaoCriado
  }

  async findAll() {
    const caminhoes = await this.caminhaoRepository.find({
      relations: {
        remessas: true,
      },
    });
  
    if (caminhoes.length === 0) {
      throw new NotFoundException('Não existem caminhões cadastrados!');
    }
  
    return caminhoes
  }

  async findOne(id: string): Promise<listaCaminhaoDTO> {
    const caminhao = await this.caminhaoRepository.findOne({
      where: { id },
      relations: { remessas: true },
    });
  
    if (!caminhao) {
      throw new NotFoundException('Esse caminhão não existe no nosso banco de dados!');
    }
  
    return {
      id: caminhao.id,
      placa: caminhao.placa,
      capacidade: caminhao.capacidade,
      modelo: caminhao.modelo,
      marca: caminhao.marca,
      status: caminhao.status,
      cor: caminhao.cor,
      capacidadeDisponivel: caminhao.capacidadeDisponivel,
      idMotorista: caminhao.idMotorista,
      remessa: caminhao.remessas.map((remessa) => ({
        id: remessa.id,
        descricao: remessa.descricao,
        peso: remessa.peso,
      })),
    };
  }

  async update(id: string, updateCaminhoeDto: UpdateCaminhoeDto) {
    const caminhaoEncontrado = await this.caminhaoExists(id)
    Object.assign(caminhaoEncontrado, updateCaminhoeDto)
    const caminhaoAtualizado = await this.caminhaoRepository.save(caminhaoEncontrado);

    return caminhaoAtualizado;
}

  async remove(id: string) {
    const caminhao = await this.findOne(id); 
  
    const result = await this.caminhaoRepository.delete(id);
  
    if (result.affected && result.affected > 0) {
      return {
        mensagem: 'Caminhao excluído com sucesso',
        caminhao: caminhao,
      };
    } else {
      throw new NotFoundException('Caminhao não encontrado ou já foi excluído.');
    }
  }
  }

