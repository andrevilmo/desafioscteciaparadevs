import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { EmpreendimentoList } from '../EmpreendimentoList';
import { empreendimentoService } from '../../services/api';
import { SegmentoAtuacao, Status } from '../../types/empreendimento';

// Mock do serviço
jest.mock('../../services/api');

const mockEmpreendimentoService = empreendimentoService as jest.Mocked<typeof empreendimentoService>;

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('EmpreendimentoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state', () => {
    mockEmpreendimentoService.getAll.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(<EmpreendimentoList />);

    expect(screen.getByText(/Carregando empreendimentos/i)).toBeInTheDocument();
  });

  it('displays error state', async () => {
    mockEmpreendimentoService.getAll.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<EmpreendimentoList />);

    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar empreendimentos/i)).toBeInTheDocument();
    });
  });

  it('displays empty state when no empreendimentos', async () => {
    mockEmpreendimentoService.getAll.mockResolvedValue([]);

    renderWithProviders(<EmpreendimentoList />);

    await waitFor(() => {
      expect(screen.getByText(/Nenhum empreendimento cadastrado ainda/i)).toBeInTheDocument();
      expect(screen.getByText(/0 empreendimento\(s\) cadastrado\(s\)/i)).toBeInTheDocument();
    });
  });

  it('displays list of empreendimentos', async () => {
    const mockEmpreendimentos = [
      {
        _id: '1',
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        nomeEmpreendimento: 'Comércio Plus',
        nomeEmpreendedor: 'Maria Santos',
        municipio: 'Joinville',
        segmento: SegmentoAtuacao.COMERCIO,
        emailContato: 'maria@comercio.com',
        status: Status.ATIVO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockEmpreendimentoService.getAll.mockResolvedValue(mockEmpreendimentos);

    renderWithProviders(<EmpreendimentoList />);

    await waitFor(() => {
      expect(screen.getByText('Tech Solutions')).toBeInTheDocument();
      expect(screen.getByText('Comércio Plus')).toBeInTheDocument();
      expect(screen.getByText(/2 empreendimento\(s\) cadastrado\(s\)/i)).toBeInTheDocument();
    });
  });

  it('displays correct count', async () => {
    const mockEmpreendimentos = [
      {
        _id: '1',
        nomeEmpreendimento: 'Tech Solutions',
        nomeEmpreendedor: 'João Silva',
        municipio: 'Florianópolis',
        segmento: SegmentoAtuacao.TECNOLOGIA,
        emailContato: 'joao@tech.com',
        status: Status.ATIVO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    mockEmpreendimentoService.getAll.mockResolvedValue(mockEmpreendimentos);

    renderWithProviders(<EmpreendimentoList />);

    await waitFor(() => {
      expect(screen.getByText(/1 empreendimento\(s\) cadastrado\(s\)/i)).toBeInTheDocument();
    });
  });
});
