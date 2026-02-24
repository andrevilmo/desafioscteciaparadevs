import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { EmpreendimentoCard } from '../EmpreendimentoCard';
import { Empreendimento, SegmentoAtuacao, Status } from '../../types/empreendimento';

const mockEmpreendimento: Empreendimento = {
  _id: '1',
  nomeEmpreendimento: 'Test Business',
  nomeEmpreendedor: 'John Doe',
  municipio: 'Florianópolis',
  segmento: SegmentoAtuacao.TECNOLOGIA,
  emailContato: 'john@test.com',
  status: Status.ATIVO,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

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

describe('EmpreendimentoCard', () => {
  it('renders empreendimento information correctly', () => {
    renderWithProviders(<EmpreendimentoCard empreendimento={mockEmpreendimento} />);

    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Florianópolis')).toBeInTheDocument();
    expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('displays status badge correctly', () => {
    renderWithProviders(<EmpreendimentoCard empreendimento={mockEmpreendimento} />);

    const statusBadge = screen.getByText('ativo');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('status-badge', 'ativo');
  });

  it('renders edit and delete buttons', () => {
    renderWithProviders(<EmpreendimentoCard empreendimento={mockEmpreendimento} />);

    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('displays inactive status badge correctly', () => {
    const inactiveEmpreendimento = {
      ...mockEmpreendimento,
      status: Status.INATIVO,
    };

    renderWithProviders(<EmpreendimentoCard empreendimento={inactiveEmpreendimento} />);

    const statusBadge = screen.getByText('inativo');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('status-badge', 'inativo');
  });

  it('displays all segmentos correctly', () => {
    const segmentos = Object.values(SegmentoAtuacao);

    segmentos.forEach((segmento) => {
      const empreendimento = {
        ...mockEmpreendimento,
        segmento,
      };

      const { unmount } = renderWithProviders(
        <EmpreendimentoCard empreendimento={empreendimento} />
      );

      expect(screen.getByText(segmento)).toBeInTheDocument();
      unmount();
    });
  });
});
