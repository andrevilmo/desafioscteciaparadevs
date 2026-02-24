import { Request, Response, NextFunction } from 'express';
import { EmpreendimentoService } from '../services/Empreendimento.service';
import { EmpreendimentoRepository } from '../repositories/Empreendimento.repository';
import { CreateEmpreendimentoDto, UpdateEmpreendimentoDto } from '../dto/Empreendimento.dto';

const repository = new EmpreendimentoRepository();
const service = new EmpreendimentoService(repository);

export class EmpreendimentoController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateEmpreendimentoDto = req.body;
      const empreendimento = await service.create(data);
      res.status(201).json({
        success: true,
        data: empreendimento,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const empreendimentos = await service.findAll();
      res.status(200).json({
        success: true,
        data: empreendimentos,
        count: empreendimentos.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const empreendimento = await service.findById(id);
      res.status(200).json({
        success: true,
        data: empreendimento,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateEmpreendimentoDto = req.body;
      const empreendimento = await service.update(id, data);
      res.status(200).json({
        success: true,
        data: empreendimento,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(200).json({
        success: true,
        message: 'Empreendimento deletado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
}
