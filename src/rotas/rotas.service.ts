import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRotaDto } from './dto/create-rota.dto';
import { UpdateRotaDto } from './dto/update-rota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RotaEntity } from './entities/rota.entity';
import { Repository } from 'typeorm';
import { DistanceService } from 'src/rotas/createDistance.service';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';

@Injectable()
export class RotasService {
  constructor(
    @InjectRepository(RotaEntity)
    private readonly rotaRepository: Repository<RotaEntity>,
    @InjectRepository(CaminhaoEntity)
    private readonly caminhaoRepository: Repository<CaminhaoEntity>,
    private readonly distanceService: DistanceService,
    private readonly caminhaoService: CaminhoesService,
  ){

  }
  async create(createRotaDto: CreateRotaDto) {
    const rota = new RotaEntity()
    if(createRotaDto.idCaminhao){
      const caminhao = await this.caminhaoService.caminhaoExists(createRotaDto.idCaminhao)
      rota.caminhao = caminhao
    }
    else{
      rota.caminhao = null
    }
  
    const distanciaInfo = await this.distanceService.calcularDistancia(createRotaDto.origem, createRotaDto.destino);

    rota.destino = createRotaDto.destino
    rota.origem = createRotaDto.origem
    rota.status = createRotaDto.status
    rota.distanciaKm = distanciaInfo.distancia_km
    rota.duracao = distanciaInfo.duracao
    //rota.distanciaKm = createRotaDto.distanciaKm
    
    

    const rotaSalva = await this.rotaRepository.save(rota)

    return {
      message:'Rota salva com sucesso',
      rotaSalva
    }
  }

 async findAll() {
    const rotas = await this.rotaRepository.find({relations:{
      caminhao:true
    }})
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
    },
    relations:{
      caminhao:true,
      remessas:true
    }
  })
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

    if(updateRotaDto.idCaminhao){
      const caminhao = await this.caminhaoService.caminhaoExists(updateRotaDto.idCaminhao)
      const podeAtribuir = await this.verificarCapacidadeCaminhao(id, updateRotaDto.idCaminhao)
      if(!podeAtribuir){
        throw new BadRequestException('Esse caminhão não suporta a carga que está atribuida a essa rota!')
      }
      rotaEncontrada.caminhao = caminhao
      caminhao.remessas = rotaEncontrada.remessas
      caminhao.capacidadeDisponivel = caminhao.capacidade - rotaEncontrada.remessas.reduce((soma, remessa) => soma + Number(remessa.peso), 0)
      await this.caminhaoRepository.save(caminhao)
      }
      else if(updateRotaDto.idCaminhao == null){
        rotaEncontrada.caminhao = null
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

  async listarRemessasDaRota(idRota: string){
    const rota = await this.rotaRepository.findOne({
      where: { id: idRota },
      relations: { remessas: true },
    });
  
    if (!rota) {
      throw new NotFoundException('Rota não encontrada.');
    }
  
    return rota.remessas;
  }

  async verificarCapacidadeCaminhao(
    idRota: string,
    idCaminhao: string,
    pesoNovaRemessa: number = 0 
  ): Promise<boolean> {
    const caminhao = await this.caminhaoService.findOne(idCaminhao);
    const remessas = await this.listarRemessasDaRota(idRota);
    const pesoTotal = remessas.reduce((soma, remessa) => soma + Number(remessa.peso), 0) + Number(pesoNovaRemessa);
  
    return pesoTotal <= caminhao.capacidade;
  }
  

  

  
}
