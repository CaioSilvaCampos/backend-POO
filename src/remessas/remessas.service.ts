import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRemessaDto } from './dto/create-remessa.dto';
import { UpdateRemessaDto } from './dto/update-remessa.dto';
import { RemessaEntity } from './entities/remessa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RotasService } from 'src/rotas/rotas.service';
import { RemessaRespostaDto } from './dto/lista-remessa.dto';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';

@Injectable()
export class RemessasService {
  constructor(
    @InjectRepository(RemessaEntity)
        private readonly remessaRepository: Repository<RemessaEntity>,
    @InjectRepository(CaminhaoEntity)
        private readonly caminhaoRepository: Repository<CaminhaoEntity>,
        private readonly rotaService: RotasService,
  ){

  }
  async create(createRemessaDto: CreateRemessaDto) {
    const rota = await this.rotaService.findOne(createRemessaDto.idRota)
    const remessa = new RemessaEntity()
    remessa.descricao = createRemessaDto.descricao
    remessa.destinatario = createRemessaDto.destinatario
    remessa.status = createRemessaDto.status
    remessa.prioridade = createRemessaDto.prioridade
    remessa.rota = rota
    if(rota.caminhao?.id){
      const podeAtribuir = await this.rotaService.verificarCapacidadeCaminhao(rota.id, rota.caminhao.id, createRemessaDto.peso)
      if(!podeAtribuir){
        throw new BadRequestException('Essa carga excede a capacidade do caminhao!')
      }
      rota.caminhao.remessas = rota.remessas
      rota.caminhao.capacidadeDisponivel -= createRemessaDto.peso
      await this.caminhaoRepository.save(rota.caminhao)
    }
    remessa.peso = createRemessaDto.peso
    remessa.tipo = createRemessaDto.tipo
    await this.remessaRepository.save(remessa)
    return {
      message: 'Remessa criada com sucesso',
      remessa
  }
  }

  async findAll(): Promise<RemessaRespostaDto[]> {
    const remessas = await this.remessaRepository.find({relations:{
      rota:true
    },
  })

    if(remessas.length === 0){
      throw new NotFoundException('Não existem remessas cadastradas!')
    }

    else{
      return remessas.map((remessa) => ({
        id: remessa.id,
        descricao: remessa.descricao,
        destinatario: remessa.destinatario,
        status: remessa.status,
        prioridade: remessa.prioridade,
        tipo:remessa.tipo,
        peso:remessa.peso,
        rota: {
          origem: remessa.rota.origem,
          destino: remessa.rota.destino,
          duracao: remessa.rota.duracao
        },
      }));
    }
  }

  async remessaExists(id:string){
    const remessa = await this.remessaRepository.findOne({where:{
      id:id
    },
    relations:{
      rota:true
    }
  })
    if(remessa == null){
      throw new NotFoundException('Essa remessa não esta cadastrada no nosso banco de dados!')
    }
    else{
      return remessa
    }
  }

  async findOne(id: string): Promise<RemessaRespostaDto> {
    const remessa = await this.remessaExists(id)
    return {
      id: remessa.id,
      descricao: remessa.descricao,
      destinatario: remessa.destinatario,
      status: remessa.status,
      prioridade: remessa.prioridade,
      peso:remessa.peso,
      tipo:remessa.tipo,
      rota: {
        origem: remessa.rota.origem,
        destino: remessa.rota.destino,
        duracao: remessa.rota.duracao
      },
    };
  }

  async update(id: string, updateRemessaDto: UpdateRemessaDto) {
    const remessaEncontrada = await this.remessaExists(id)
    if(updateRemessaDto.idRota){
      await this.rotaService.findOne(updateRemessaDto.idRota)
    }
    if (updateRemessaDto.peso) {
      const idRota = updateRemessaDto.idRota ?? remessaEncontrada.rota.id;
      const rota = await this.rotaService.findOne(idRota);
      if (rota.caminhao) {
        const podeAtualizar = await this.rotaService.verificarCapacidadeCaminhao(
          idRota,
          rota.caminhao.id,
          updateRemessaDto.peso 
        );
  
        if (!podeAtualizar) {
          throw new BadRequestException('Essa atualização excede a capacidade do caminhão!');
        }
        rota.caminhao.capacidadeDisponivel -= updateRemessaDto.peso
      }
    }
    Object.assign(remessaEncontrada, updateRemessaDto)
      const remessaAtualizada = await this.remessaRepository.save(remessaEncontrada)
      return {
        message:'Remessa atualizada com sucesso',
        remessaAtualizada
      }
  }

  async remove(id: string) {
    const remessaEncontrada = await this.findOne(id)
    const result = await this.remessaRepository.delete(id);
  
    if (result.affected && result.affected > 0) {
      return {
        mensagem: 'Remessa excluída com sucesso',
        remessa:remessaEncontrada
      };
    } else {
      throw new NotFoundException('Não foi possivel excluir a rota.');
    }
  }
  }

