import request from 'supertest';
import app from '../index';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Empreendimento } from '../models/Empreendimento.model';
import { SegmentoAtuacao, Status } from '../models/Empreendimento.model';

describe('Empreendimento API - Integration Tests', () => {
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

  describe('Field Validation Tests', () => {
    it('should return 400 if nomeEmpreendimento exceeds max length', async () => {
      const longName = 'a'.repeat(201);
      const empreendimentoData = {
        nomeEmpreendimento: longName,
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('200 caracteres');
    });

    it('should return 400 if nomeEmpreendedor exceeds max length', async () => {
      const longName = 'a'.repeat(201);
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: longName,
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if municipio exceeds max length', async () => {
      const longMunicipio = 'a'.repeat(101);
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: longMunicipio,
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if emailContato exceeds max length', async () => {
      const longEmail = 'a'.repeat(201);
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: longEmail,
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should accept all valid segmentos', async () => {
      const segmentos = Object.values(SegmentoAtuacao);

      for (const segmento of segmentos) {
        const empreendimentoData = {
          nomeEmpreendimento: `Test ${segmento}`,
          nomeEmpreendedor: 'João Silva',
          municipio: 'Florianópolis',
          segmento,
          emailContato: 'joao@test.com',
        };

        const response = await request(app)
          .post('/api/empreendimentos')
          .send(empreendimentoData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.segmento).toBe(segmento);

        // Cleanup
        await Empreendimento.deleteMany({});
      }
    });

    it('should accept both status values', async () => {
      const statuses = Object.values(Status);

      for (const status of statuses) {
        const empreendimentoData = {
          nomeEmpreendimento: `Test ${status}`,
          nomeEmpreendedor: 'João Silva',
          municipio: 'Florianópolis',
          segmento: SegmentoAtuacao.TECNOLOGIA,
          emailContato: 'joao@test.com',
          status,
        };

        const response = await request(app)
          .post('/api/empreendimentos')
          .send(empreendimentoData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe(status);

        // Cleanup
        await Empreendimento.deleteMany({});
      }
    });
  });

  describe('Update Partial Tests', () => {
    it('should update only provided fields', async () => {
      const empreendimento = await Empreendimento.create({
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
      });

      const updateData = {
        status: Status.INATIVO,
      };

      const response = await request(app)
        .put(`/api/empreendimentos/${empreendimento._id.toString()}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(Status.INATIVO);
      expect(response.body.data.nomeEmpreendimento).toBe('Tech Solutions'); // Should remain unchanged
    });

    it('should update multiple fields at once', async () => {
      const empreendimento = await Empreendimento.create({
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
      });

      const updateData = {
        nomeEmpreendimento: 'Updated Name',
        municipio: 'Joinville',
        segmento: SegmentoAtuacao.COMERCIO,
      };

      const response = await request(app)
        .put(`/api/empreendimentos/${empreendimento._id.toString()}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nomeEmpreendimento).toBe('Updated Name');
      expect(response.body.data.municipio).toBe('Joinville');
      expect(response.body.data.segmento).toBe(SegmentoAtuacao.COMERCIO);
    });
  });

  describe('Response Structure Tests', () => {
    it('should return correct response structure on create', async () => {
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(201);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should return correct error structure on validation error', async () => {
      const response = await request(app)
        .post('/api/empreendimentos')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('message');
      expect(response.body.error).toHaveProperty('statusCode');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values correctly', async () => {
      const empreendimentoData = {
        nomeEmpreendimento: '',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle special characters in fields', async () => {
      const empreendimentoData = {
        nomeEmpreendimento: 'Tech Solutions & Co. - 2024',
        nomeEmpreendedor: 'João Silva "JS"',
        municipio: 'São José',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao+test@tech.com',
        status: Status.ATIVO,
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nomeEmpreendimento).toBe('Tech Solutions & Co. - 2024');
      expect(response.body.data.nomeEmpreendedor).toBe('João Silva "JS"');
    });

    it('should handle whitespace trimming', async () => {
      const empreendimentoData = {
        nomeEmpreendimento: '  Tech Solutions  ',
        nomeEmpreendedor: '  João Silva  ',
        municipio: '  Florianópolis  ',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: '  joao@tech.com  ',
      };

      const response = await request(app)
        .post('/api/empreendimentos')
        .send(empreendimentoData)
        .expect(201);

      // Mongoose trim should remove whitespace
      expect(response.body.data.nomeEmpreendimento).toBe('Tech Solutions');
      expect(response.body.data.nomeEmpreendedor).toBe('João Silva');
    });
  });
});
