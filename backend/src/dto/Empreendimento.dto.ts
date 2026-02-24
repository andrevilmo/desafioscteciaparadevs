import { SegmentoAtuacao, Status } from '../models/Empreendimento.model';

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

export interface EmpreendimentoResponseDto {
  _id: string;
  nomeEmpreendimento: string;
  nomeEmpreendedor: string;
  municipio: string;
  segmento: SegmentoAtuacao;
  emailContato: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
