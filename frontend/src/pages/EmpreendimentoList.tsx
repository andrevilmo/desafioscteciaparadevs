import { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { empreendimentoService } from '../services/api';
import { EmpreendimentoCard } from '../components/EmpreendimentoCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Empreendimento, SegmentoAtuacao, Status } from '../types/empreendimento';
import './EmpreendimentoList.css';

export const EmpreendimentoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegmento, setFilterSegmento] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: empreendimentos, isLoading, error } = useQuery(
    'empreendimentos',
    empreendimentoService.getAll
  );

  const filteredEmpreendimentos = useMemo(() => {
    if (!empreendimentos) return [];

    return empreendimentos.filter((emp: Empreendimento) => {
      const matchesSearch =
        emp.nomeEmpreendimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.nomeEmpreendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emailContato.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSegmento = filterSegmento === 'all' || emp.segmento === filterSegmento;
      const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;

      return matchesSearch && matchesSegmento && matchesStatus;
    });
  }, [empreendimentos, searchTerm, filterSegmento, filterStatus]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" message="Carregando empreendimentos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Erro ao carregar empreendimentos</h3>
        <p>Tente novamente mais tarde ou verifique sua conexão.</p>
      </div>
    );
  }

  return (
    <div className="empreendimento-list">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Lista de Empreendimentos</h2>
            <p className="page-subtitle">
              {filteredEmpreendimentos.length} de {empreendimentos?.length || 0} empreendimento(s)
            </p>
          </div>
          <Link to="/novo" className="btn btn-primary btn-new">
            ➕ Novo Empreendimento
          </Link>
        </div>
      </div>

      {(empreendimentos && empreendimentos.length > 0) || searchTerm || filterSegmento !== 'all' || filterStatus !== 'all' ? (
        <>
          <div className="filters-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar por nome, empreendedor, município ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filters-row">
              <div className="filter-group">
                <label htmlFor="filter-segmento">Segmento:</label>
                <select
                  id="filter-segmento"
                  value={filterSegmento}
                  onChange={(e) => setFilterSegmento(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos</option>
                  {Object.values(SegmentoAtuacao).map((segmento) => (
                    <option key={segmento} value={segmento}>
                      {segmento}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="filter-status">Status:</label>
                <select
                  id="filter-status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos</option>
                  <option value={Status.ATIVO}>Ativo</option>
                  <option value={Status.INATIVO}>Inativo</option>
                </select>
              </div>

              {(searchTerm || filterSegmento !== 'all' || filterStatus !== 'all') && (
                <button
                  className="btn btn-secondary btn-clear-filters"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterSegmento('all');
                    setFilterStatus('all');
                  }}
                >
                  🗑️ Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {filteredEmpreendimentos.length > 0 ? (
            <div className="empreendimentos-grid">
              {filteredEmpreendimentos.map((empreendimento) => (
                <EmpreendimentoCard key={empreendimento._id} empreendimento={empreendimento} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Nenhum resultado encontrado</h3>
              <p>Tente ajustar os filtros ou termo de busca.</p>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilterSegmento('all');
                  setFilterStatus('all');
                }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nenhum empreendimento cadastrado ainda</h3>
          <p>Comece cadastrando seu primeiro empreendimento.</p>
          <Link to="/novo" className="btn btn-primary">
            ➕ Cadastrar Primeiro Empreendimento
          </Link>
        </div>
      )}
    </div>
  );
};
