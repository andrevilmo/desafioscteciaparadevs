export enum SegmentoAtuacao {
  TECNOLOGIA = 'Tecnologia',
  COMERCIO = 'Comércio',
  INDUSTRIA = 'Indústria',
  SERVICOS = 'Serviços',
  AGRONEGOCIO = 'Agronegócio',
}

export enum Status {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

export interface Empreendimento {
  _id: string;
  nomeEmpreendimento: string;
  nomeEmpreendedor: string;
  municipio: string;
  segmento: SegmentoAtuacao;
  emailContato: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmpreendimentoDto {
  nomeEmpreendimento: string;
  nomeEmpreendedor: string;
  municipio: string;
  segmento: SegmentoAtuacao;
  emailContato: string;
  status?: Status;
}

export interface UpdateEmpreendimentoDto {
  nomeEmpreendimento?: string;
  nomeEmpreendedor?: string;
  municipio?: string;
  segmento?: SegmentoAtuacao;
  emailContato?: string;
  status?: Status;
}
