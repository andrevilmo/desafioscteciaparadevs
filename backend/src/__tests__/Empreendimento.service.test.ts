import { EmpreendimentoService } from '../services/Empreendimento.service';
import { EmpreendimentoRepository } from '../repositories/Empreendimento.repository';
import { CreateEmpreendimentoDto, UpdateEmpreendimentoDto } from '../dto/Empreendimento.dto';
import { NotFoundError, ValidationError } from '../errors/AppError';
import { SegmentoAtuacao, Status, IEmpreendimento } from '../models/Empreendimento.model';
import mongoose from 'mongoose';

describe('EmpreendimentoService', () => {
  let service: EmpreendimentoService;
  let repository: EmpreendimentoRepository;
  let mockRepository: jest.Mocked<EmpreendimentoRepository>;

  beforeEach(() => {
    repository = new EmpreendimentoRepository();
    service = new EmpreendimentoService(repository);
    
    // Mock do repository
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByMunicipio: jest.fn(),
      findBySegmento: jest.fn(),
      findByStatus: jest.fn(),
    } as any;

    service = new EmpreendimentoService(mockRepository);
  });

  describe('create', () => {
    it('should create a new empreendimento successfully', async () => {
      const createDto: CreateEmpreendimentoDto = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
      };

      const mockEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(),
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(mockEmpreendimento as IEmpreendimento);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result.nomeEmpreendimento).toBe(createDto.nomeEmpreendimento);
      expect(result.segmento).toBe(createDto.segmento);
      expect(result._id).toBeDefined();
    });

    it('should throw ValidationError when repository throws ValidationError', async () => {
      const createDto: CreateEmpreendimentoDto = {
        nomeEmpreendimento: '',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
      };

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      mockRepository.create.mockRejectedValue(validationError);

      await expect(service.create(createDto)).rejects.toThrow(ValidationError);
    });

    it('should use default status ATIVO when not provided', async () => {
      const createDto: CreateEmpreendimentoDto = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
      };

      const mockEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(),
        ...createDto,
        status: Status.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(mockEmpreendimento as IEmpreendimento);

      const result = await service.create(createDto);
      expect(result.status).toBe(Status.ATIVO);
    });
  });

  describe('findAll', () => {
    it('should return all empreendimentos', async () => {
      const mockEmpreendimentos: Partial<IEmpreendimento>[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          nomeEmpreendimento: 'Tech Solutions',
          nomeEmpreendedor: 'João Silva',
          municipio: 'Florianópolis',
          segmento: SegmentoAtuacao.TECNOLOGIA,
          emailContato: 'joao@tech.com',
          status: Status.ATIVO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: new mongoose.Types.ObjectId(),
          nomeEmpreendimento: 'Comércio Plus',
          nomeEmpreendedor: 'Maria Santos',
          municipio: 'Joinville',
          segmento: SegmentoAtuacao.COMERCIO,
          emailContato: 'maria@comercio.com',
          status: Status.ATIVO,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockEmpreendimentos as IEmpreendimento[]);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].nomeEmpreendimento).toBe('Tech Solutions');
      expect(result[1].nomeEmpreendimento).toBe('Comércio Plus');
    });

    it('should return empty array when no empreendimentos exist', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return empreendimento when found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const mockEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(id),
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockEmpreendimento as IEmpreendimento);

      const result = await service.findById(id);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(result._id).toBe(id);
      expect(result.nomeEmpreendimento).toBe('Tech Solutions');
    });

    it('should throw NotFoundError when empreendimento not found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundError);
      await expect(service.findById(id)).rejects.toThrow('Empreendimento não encontrado');
    });
  });

  describe('update', () => {
    it('should update empreendimento successfully', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const updateDto: UpdateEmpreendimentoDto = {
        nomeEmpreendimento: 'Tech Solutions Updated',
        status: Status.INATIVO,
      };

      const existingEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(id),
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedEmpreendimento: Partial<IEmpreendimento> = {
        ...existingEmpreendimento,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(existingEmpreendimento as IEmpreendimento);
      mockRepository.update.mockResolvedValue(updatedEmpreendimento as IEmpreendimento);

      const result = await service.update(id, updateDto);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.update).toHaveBeenCalledWith(id, updateDto);
      expect(result.nomeEmpreendimento).toBe(updateDto.nomeEmpreendimento);
      expect(result.status).toBe(updateDto.status);
    });

    it('should throw NotFoundError when empreendimento not found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(id, { nomeEmpreendimento: 'Updated' })).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError when update fails validation', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const existingEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(id),
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';

      mockRepository.findById.mockResolvedValue(existingEmpreendimento as IEmpreendimento);
      mockRepository.update.mockRejectedValue(validationError);

      await expect(service.update(id, { nomeEmpreendimento: '' })).rejects.toThrow(ValidationError);
    });
  });

  describe('delete', () => {
    it('should delete empreendimento successfully', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const existingEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(id),
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(existingEmpreendimento as IEmpreendimento);
      mockRepository.delete.mockResolvedValue(true);

      await service.delete(id);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundError when empreendimento not found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when delete returns false', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const existingEmpreendimento: Partial<IEmpreendimento> = {
        _id: new mongoose.Types.ObjectId(id),
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(existingEmpreendimento as IEmpreendimento);
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete(id)).rejects.toThrow(NotFoundError);
    });
  });
});
