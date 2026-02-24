import axios from 'axios';
import { Empreendimento, CreateEmpreendimentoDto, UpdateEmpreendimentoDto } from '../types/empreendimento';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const empreendimentoService = {
  getAll: async (): Promise<Empreendimento[]> => {
    const response = await api.get('/empreendimentos');
    return response.data.data;
  },

  getById: async (id: string): Promise<Empreendimento> => {
    const response = await api.get(`/empreendimentos/${id}`);
    return response.data.data;
  },

  create: async (data: CreateEmpreendimentoDto): Promise<Empreendimento> => {
    const response = await api.post('/empreendimentos', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateEmpreendimentoDto): Promise<Empreendimento> => {
    const response = await api.put(`/empreendimentos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/empreendimentos/${id}`);
  },
};
