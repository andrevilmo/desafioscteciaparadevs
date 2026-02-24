import { IEmpreendimento, Empreendimento } from '../models/Empreendimento.model';
import { CreateEmpreendimentoDto, UpdateEmpreendimentoDto } from '../dto/Empreendimento.dto';

export class EmpreendimentoRepository {
  async create(data: CreateEmpreendimentoDto): Promise<IEmpreendimento> {
    const empreendimento = new Empreendimento(data);
    return await empreendimento.save();
  }

  async findAll(): Promise<IEmpreendimento[]> {
    return await Empreendimento.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IEmpreendimento | null> {
    return await Empreendimento.findById(id);
  }

  async update(id: string, data: UpdateEmpreendimentoDto): Promise<IEmpreendimento | null> {
    return await Empreendimento.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await Empreendimento.findByIdAndDelete(id);
    return result !== null;
  }

  async findByMunicipio(municipio: string): Promise<IEmpreendimento[]> {
    return await Empreendimento.find({ municipio }).sort({ createdAt: -1 });
  }

  async findBySegmento(segmento: string): Promise<IEmpreendimento[]> {
    return await Empreendimento.find({ segmento }).sort({ createdAt: -1 });
  }

  async findByStatus(status: string): Promise<IEmpreendimento[]> {
    return await Empreendimento.find({ status }).sort({ createdAt: -1 });
  }
}
