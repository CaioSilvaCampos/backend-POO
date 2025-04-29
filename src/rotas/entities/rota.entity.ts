import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusRota } from "../enum/statusRota.enum";
import { RemessaEntity } from "src/remessas/entities/remessa.entity";

@Entity('rotas')
export class RotaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false})
    origem: string;

    @Column({nullable:false})
    destino: string;

    @Column({nullable:false})
    distanciaKm: string;

    @Column({enum:StatusRota, nullable:false})
    status: StatusRota

    @Column({nullable:true})
    duracao:string;

    @Column({nullable:true})
    idCaminhao: string

    @OneToMany(()=> RemessaEntity, remessa=> remessa.rota)
    remessas: RemessaEntity[]
}
