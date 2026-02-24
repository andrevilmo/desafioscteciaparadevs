# 🧪 Guia de Testes

## Visão Geral

O projeto possui uma suíte completa de testes cobrindo backend e frontend, seguindo as melhores práticas de testing.

## Estrutura de Testes

### Backend

#### Testes de Integração (`empreendimento.test.ts`)
- ✅ Testes completos de todos os endpoints da API
- ✅ Validação de campos obrigatórios
- ✅ Testes de casos de erro (404, 400)
- ✅ Testes de CRUD completo

#### Testes de Integração Avançados (`empreendimento.integration.test.ts`)
- ✅ Validação de limites de campos (max length)
- ✅ Testes de todos os segmentos e status válidos
- ✅ Testes de atualização parcial
- ✅ Testes de estrutura de resposta
- ✅ Testes de edge cases (caracteres especiais, whitespace)

#### Testes Unitários (`Empreendimento.service.test.ts`)
- ✅ Testes isolados da camada de serviço
- ✅ Mock do repository
- ✅ Testes de todos os métodos do service
- ✅ Testes de tratamento de erros
- ✅ Testes de validação e transformação de dados

### Frontend

#### Testes de Componentes (`EmpreendimentoCard.test.tsx`)
- ✅ Renderização de informações
- ✅ Exibição de status badge
- ✅ Testes de botões de ação
- ✅ Testes de diferentes segmentos

#### Testes de Páginas (`EmpreendimentoList.test.tsx`, `EmpreendimentoForm.test.tsx`)
- ✅ Estados de loading, error e empty
- ✅ Validação de formulários
- ✅ Testes de submissão
- ✅ Testes de navegação

## Executar Testes

### Backend

```bash
cd backend

# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage
```

### Frontend

```bash
cd frontend

# Executar todos os testes
npm test

# Executar em modo watch
npm test -- --watch

# Executar com cobertura
npm run test:coverage
```

### Todos os Testes

```bash
# Na raiz do projeto
npm test
```

## Cobertura de Testes

### Backend
- **Endpoints API**: 100% cobertura
- **Service Layer**: Testes unitários completos
- **Validações**: Todos os casos testados
- **Error Handling**: Todos os cenários de erro

### Frontend
- **Componentes**: Testes de renderização e interação
- **Páginas**: Testes de estados e fluxos
- **Formulários**: Validação e submissão

## Tipos de Testes

### 1. Testes de Integração
Testam o fluxo completo da aplicação, incluindo:
- Conexão com banco de dados
- Rotas e middlewares
- Validação de entrada
- Respostas HTTP

### 2. Testes Unitários
Testam componentes isolados:
- Services com mocks
- Lógica de negócio
- Transformação de dados

### 3. Testes de Componentes (Frontend)
Testam componentes React:
- Renderização
- Interações do usuário
- Estados e props

## Melhores Práticas Aplicadas

1. **AAA Pattern** (Arrange, Act, Assert)
2. **Testes isolados** - Cada teste é independente
3. **Mocks apropriados** - Para dependências externas
4. **Nomes descritivos** - Testes auto-documentados
5. **Cobertura completa** - Todos os cenários importantes
6. **Testes rápidos** - Execução em segundos

## Adicionar Novos Testes

### Backend

Crie arquivos em `backend/src/__tests__/`:

```typescript
import request from 'supertest';
import app from '../index';

describe('Novo Endpoint', () => {
  it('should do something', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

### Frontend

Crie arquivos em `frontend/src/**/__tests__/`:

```typescript
import { render, screen } from '@testing-library/react';
import { Component } from '../Component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Estatísticas de Testes

- **Total de Testes Backend**: 38
- **Total de Testes Frontend**: 10+
- **Cobertura**: Alta em todas as áreas críticas
- **Tempo de Execução**: ~5 segundos (backend), ~2 segundos (frontend)

## Troubleshooting

### Testes falhando

1. Verifique se o MongoDB está rodando
2. Verifique se as dependências estão instaladas
3. Execute `npm test` para ver erros detalhados

### Timeout em testes

Aumente o timeout no arquivo de teste:
```typescript
jest.setTimeout(10000); // 10 segundos
```

### Problemas com mocks

Certifique-se de limpar mocks entre testes:
```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```
