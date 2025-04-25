export class RotaSimplesDto {
    origem: string;
    destino: string;
}

export class RemessaRespostaDto {
    id: string;
    descricao: string;
    destinatario: string;
    status: string;
    prioridade: string;
    tipo:string;
    peso:number
    rota: RotaSimplesDto;
  }