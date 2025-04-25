import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { statusCaminhao } from "../enum/statusCaminho.enum";

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
}
