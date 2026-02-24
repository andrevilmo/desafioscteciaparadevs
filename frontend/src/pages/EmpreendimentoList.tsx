import { useQuery } from 'react-query';
import { empreendimentoService } from '../services/api';
import { EmpreendimentoCard } from '../components/EmpreendimentoCard';
import './EmpreendimentoList.css';

export const EmpreendimentoList = () => {
  const { data: empreendimentos, isLoading, error } = useQuery(
    'empreendimentos',
    empreendimentoService.getAll
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando empreendimentos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erro ao carregar empreendimentos. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="empreendimento-list">
      <div className="page-header">
        <h2>Lista de Empreendimentos</h2>
        <p className="page-subtitle">
          {empreendimentos?.length || 0} empreendimento(s) cadastrado(s)
        </p>
      </div>

      {empreendimentos && empreendimentos.length > 0 ? (
        <div className="empreendimentos-grid">
          {empreendimentos.map((empreendimento) => (
            <EmpreendimentoCard key={empreendimento._id} empreendimento={empreendimento} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Nenhum empreendimento cadastrado ainda.</p>
          <a href="/novo" className="btn btn-primary">
            Cadastrar Primeiro Empreendimento
          </a>
        </div>
      )}
    </div>
  );
};
