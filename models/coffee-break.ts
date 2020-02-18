export interface BaseType {
  id: number;
  titulo: string;
  title?: string;
}

export enum Status {
  Enviado,
  Cozinha,
  Recebido,
  Entregue,
  Recusado,
  Cancelado,
  'Em Preparo',
  'Saindo para entrega'
}
export interface UA extends BaseType {}
export interface Sala extends BaseType {}
export interface PD extends BaseType {}
export interface PD extends BaseType {}

export interface StatusCoffeeBreak {
  id: number;
  titulo: Status | string;
  fases?: any[];
}

export interface OrderBase {
  id: number;
  ua: UA;
  diretoria: string;
  sala: Sala;
  salas: Sala;
  statusPedido: StatusCoffeeBreak;
  data1: string | Date;
  usuarioPedido: string;
  usuarioFaturamento: string;
  usuarioCozinha: string;
  pd: PD;
}
export interface CoffeeBreak extends OrderBase {
  qtdPessoasMin: number;
  qtdPessoasMax: number;
  qtdCopos: number;
  total?: number;
}
