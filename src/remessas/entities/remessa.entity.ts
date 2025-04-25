import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusRemessa } from "../enum/statusRemessa.enum";
import { prioridadeRemessas } from "../enum/prioridadeRemessa.enum";
import { RotaEntity } from "src/rotas/entities/rota.entity";

@Entity('remessas')
export class RemessaEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false})
    descricao:string;

    @Column({nullable:false})
    destinatario:string;

    @Column({enum:StatusRemessa, nullable:false})
    status:StatusRemessa

    @Column({enum:prioridadeRemessas, nullable:false})
    prioridade:prioridadeRemessas

    @Column({nullable:false})
    tipo:string

    @Column({nullable:false})
    peso: number;

   @ManyToOne(()=> RotaEntity, rota=> rota.remessas)
    rota:RotaEntity
}
