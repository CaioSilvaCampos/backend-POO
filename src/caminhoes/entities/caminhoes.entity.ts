import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { statusCaminhao } from "../enum/statusCaminho.enum";
import { RemessaEntity } from "src/remessas/entities/remessa.entity";

@Entity('caminhoes')
export class CaminhaoEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    placa:string

    @Column()
    capacidade:number

    @Column()
    marca:string

    @Column()
    modelo:string

    @Column()
    cor:string

    @Column({enum:statusCaminhao})
    status:statusCaminhao

    @Column()
    idMotorista:string

    @OneToMany(()=> RemessaEntity, (remessa)=>remessa.caminhao)
    remessas: RemessaEntity[]
}
