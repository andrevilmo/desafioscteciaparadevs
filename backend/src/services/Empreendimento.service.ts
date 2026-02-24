import { EmpreendimentoRepository } from '../repositories/Empreendimento.repository';
import { CreateEmpreendimentoDto, UpdateEmpreendimentoDto, EmpreendimentoResponseDto } from '../dto/Empreendimento.dto';
import { IEmpreendimento } from '../models/Empreendimento.model';
import { NotFoundError, ValidationError } from '../errors/AppError';

export class EmpreendimentoService {
  private repository: EmpreendimentoRepository;

  constructor(repository: EmpreendimentoRepository) {
    this.repository = repository;
  }

  async create(data: CreateEmpreendimentoDto): Promise<EmpreendimentoResponseDto> {
    try {
      const empreendimento = await this.repository.create(data);
      return this.toResponseDto(empreendimento);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }

  async findAll(): Promise<EmpreendimentoResponseDto[]> {
    const empreendimentos = await this.repository.findAll();
    return empreendimentos.map(this.toResponseDto);
  }

  async findById(id: string): Promise<EmpreendimentoResponseDto> {
    const empreendimento = await this.repository.findById(id);
    if (!empreendimento) {
      throw new NotFoundError('Empreendimento não encontrado');
    }
    return this.toResponseDto(empreendimento);
  }

  async update(id: string, data: UpdateEmpreendimentoDto): Promise<EmpreendimentoResponseDto> {
    const empreendimento = await this.repository.findById(id);
    if (!empreendimento) {
      throw new NotFoundError('Empreendimento não encontrado');
    }

    try {
      const updated = await this.repository.update(id, data);
      if (!updated) {
        throw new NotFoundError('Empreendimento não encontrado');
      }
      return this.toResponseDto(updated);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const empreendimento = await this.repository.findById(id);
    if (!empreendimento) {
      throw new NotFoundError('Empreendimento não encontrado');
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError('Empreendimento não encontrado');
    }
  }

  private toResponseDto(empreendimento: IEmpreendimento): EmpreendimentoResponseDto {
    return {
      _id: empreendimento._id.toString(),
      nomeEmpreendimento: empreendimento.nomeEmpreendimento,
      nomeEmpreendedor: empreendimento.nomeEmpreendedor,
      municipio: empreendimento.municipio,
      segmento: empreendimento.segmento,
      emailContato: empreendimento.emailContato,
      status: empreendimento.status,
      createdAt: empreendimento.createdAt,
      updatedAt: empreendimento.updatedAt,
    };
  }
}
