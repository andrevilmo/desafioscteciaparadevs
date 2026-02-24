import mongoose, { Schema, Document } from 'mongoose';

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

export interface IEmpreendimento extends Document {
  nomeEmpreendimento: string;
  nomeEmpreendedor: string;
  municipio: string;
  segmento: SegmentoAtuacao;
  emailContato: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

const EmpreendimentoSchema: Schema = new Schema(
  {
    nomeEmpreendimento: {
      type: String,
      required: [true, 'Nome do empreendimento é obrigatório'],
      trim: true,
      maxlength: [200, 'Nome do empreendimento não pode exceder 200 caracteres'],
    },
    nomeEmpreendedor: {
      type: String,
      required: [true, 'Nome do empreendedor é obrigatório'],
      trim: true,
      maxlength: [200, 'Nome do empreendedor não pode exceder 200 caracteres'],
    },
    municipio: {
      type: String,
      required: [true, 'Município é obrigatório'],
      trim: true,
      maxlength: [100, 'Município não pode exceder 100 caracteres'],
    },
    segmento: {
      type: String,
      enum: Object.values(SegmentoAtuacao),
      required: [true, 'Segmento de atuação é obrigatório'],
    },
    emailContato: {
      type: String,
      required: [true, 'E-mail ou meio de contato é obrigatório'],
      trim: true,
      maxlength: [200, 'E-mail ou meio de contato não pode exceder 200 caracteres'],
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: [true, 'Status é obrigatório'],
      default: Status.ATIVO,
    },
  },
  {
    timestamps: true,
    collection: 'empreendimentos',
  }
);

// Indexes for better query performance
EmpreendimentoSchema.index({ municipio: 1 });
EmpreendimentoSchema.index({ segmento: 1 });
EmpreendimentoSchema.index({ status: 1 });

export const Empreendimento = mongoose.model<IEmpreendimento>(
  'Empreendimento',
  EmpreendimentoSchema
);
