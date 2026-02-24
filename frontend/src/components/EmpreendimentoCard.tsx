import { Empreendimento } from '../types/empreendimento';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { empreendimentoService } from '../services/api';
import './EmpreendimentoCard.css';

interface EmpreendimentoCardProps {
  empreendimento: Empreendimento;
}

export const EmpreendimentoCard = ({ empreendimento }: EmpreendimentoCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    () => empreendimentoService.delete(empreendimento._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('empreendimentos');
      },
    }
  );

  const handleEdit = () => {
    navigate(`/editar/${empreendimento._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este empreendimento?')) {
      try {
        await deleteMutation.mutateAsync();
      } catch (error) {
        alert('Erro ao excluir empreendimento');
      }
    }
  };

  return (
    <div className="empreendimento-card">
      <div className="card-header">
        <h3 className="card-title">{empreendimento.nomeEmpreendimento}</h3>
        <span className={`status-badge ${empreendimento.status}`}>
          {empreendimento.status}
        </span>
      </div>
      <div className="card-body">
        <div className="card-field">
          <strong>Empreendedor:</strong> {empreendimento.nomeEmpreendedor}
        </div>
        <div className="card-field">
          <strong>Município:</strong> {empreendimento.municipio}
        </div>
        <div className="card-field">
          <strong>Segmento:</strong> {empreendimento.segmento}
        </div>
        <div className="card-field">
          <strong>Contato:</strong> {empreendimento.emailContato}
        </div>
      </div>
      <div className="card-actions">
        <button className="btn btn-edit" onClick={handleEdit}>
          Editar
        </button>
        <button
          className="btn btn-delete"
          onClick={handleDelete}
          disabled={deleteMutation.isLoading}
        >
          {deleteMutation.isLoading ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </div>
  );
};
