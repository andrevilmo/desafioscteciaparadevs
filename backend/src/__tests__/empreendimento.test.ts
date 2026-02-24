import request from 'supertest';
import app from '../index';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Empreendimento } from '../models/Empreendimento.model';
import { SegmentoAtuacao, Status } from '../models/Empreendimento.model';

describe('Empreendimento API', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await Empreendimento.deleteMany({});
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await Empreendimento.deleteMany({});
  });

  describe('POST /api/empreendimentos', () => {
    it('should create a new empreendimento', async () => {
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@techsolutions.com',
        status: Status.ATIVO,
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nomeEmpreendimento).toBe(empreendimentoData.nomeEmpreendimento);
      expect(response.body.data.nomeEmpreendedor).toBe(empreendimentoData.nomeEmpreendedor);
      expect(response.body.data.municipio).toBe(empreendimentoData.municipio);
      expect(response.body.data.segmento).toBe(empreendimentoData.segmento);
      expect(response.body.data.emailContato).toBe(empreendimentoData.emailContato);
      expect(response.body.data.status).toBe(empreendimentoData.status);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/empreendimentos')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if segmento is invalid', async () => {
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: 'InvalidSegment',
        emailContato: 'joao@techsolutions.com',
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/empreendimentos', () => {
    it('should return all empreendimentos', async () => {
      const empreendimento1 = await Empreendimento.create({
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@techsolutions.com',
        status: Status.ATIVO,
      });

      const empreendimento2 = await Empreendimento.create({
        nomeEmpreendimento: 'Comércio Plus',
        nomeEmpreendedor: 'Maria Santos',
        municipio: 'Joinville',
        segmento: SegmentoAtuacao.COMERCIO,
        emailContato: 'maria@comercioplus.com',
        status: Status.ATIVO,
      });

      const response = await request(app)
        .get('/api/empreendimentos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array when no empreendimentos exist', async () => {
      const response = await request(app)
        .get('/api/empreendimentos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/empreendimentos/:id', () => {
    it('should return a specific empreendimento', async () => {
      const empreendimento = await Empreendimento.create({
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@techsolutions.com',
        status: Status.ATIVO,
      });

      const response = await request(app)
        .get(`/api/empreendimentos/${empreendimento._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(empreendimento._id.toString());
      expect(response.body.data.nomeEmpreendimento).toBe(empreendimento.nomeEmpreendimento);
    });

    it('should return 404 if empreendimento not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/empreendimentos/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if id is invalid', async () => {
      const response = await request(app)
        .get('/api/empreendimentos/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/empreendimentos/:id', () => {
    it('should update an empreendimento', async () => {
      const empreendimento = await Empreendimento.create({
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@techsolutions.com',
        status: Status.ATIVO,
      });

      const updateData = {
        nomeEmpreendimento: 'Tech Solutions Updated',
        status: Status.INATIVO,
      };

      const response = await request(app)
        .put(`/api/empreendimentos/${empreendimento._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nomeEmpreendimento).toBe(updateData.nomeEmpreendimento);
      expect(response.body.data.status).toBe(updateData.status);
    });

    it('should return 404 if empreendimento not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/empreendimentos/${fakeId}`)
        .send({ nomeEmpreendimento: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/empreendimentos/:id', () => {
    it('should delete an empreendimento', async () => {
      const empreendimento = await Empreendimento.create({
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@techsolutions.com',
        status: Status.ATIVO,
      });

      const response = await request(app)
        .delete(`/api/empreendimentos/${empreendimento._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      const deleted = await Empreendimento.findById(empreendimento._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 if empreendimento not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/empreendimentos/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
