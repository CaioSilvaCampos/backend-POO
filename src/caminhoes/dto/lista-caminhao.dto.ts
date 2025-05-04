import { statusCaminhao } from "../enum/statusCaminho.enum";

export class listaRemessaSimplesDTO{
    id: string;
    descricao: string;
    peso:number
}

export class listaCaminhaoDTO{
    id:string;
    placa:string;
    capacidade:number;
    modelo:string;
    marca:string;
    status:statusCaminhao;
    cor:string
    idMotorista:string | null;
    remessa: listaRemessaSimplesDTO[]
}