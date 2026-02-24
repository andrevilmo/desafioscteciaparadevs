import { useState } from 'react';
import { Empreendimento } from '../types/empreendimento';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { empreendimentoService } from '../services/api';
import { Modal } from './Modal';
import { useToastContext } from '../context/ToastContext';
import './EmpreendimentoCard.css';

interface EmpreendimentoCardProps {
  empreendimento: Empreendimento;
}

export const EmpreendimentoCard = ({ empreendimento }: EmpreendimentoCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToastContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation(
    () => empreendimentoService.delete(empreendimento._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('empreendimentos');
        toast.success('Empreendimento excluído com sucesso!');
      },
      onError: () => {
        toast.error('Erro ao excluir empreendimento. Tente novamente.');
      },
    }
  );

  const handleEdit = () => {
    navigate(`/editar/${empreendimento._id}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      // Error já é tratado no onError do mutation
    }
  };

  return (
    <>
      <div className="empreendimento-card">
        <div className="card-header">
          <h3 className="card-title">{empreendimento.nomeEmpreendimento}</h3>
          <span className={`status-badge ${empreendimento.status}`}>
            {empreendimento.status}
          </span>
        </div>
        <div className="card-body">
          <div className="card-field">
            <span className="field-icon">👤</span>
            <div className="field-content">
              <strong>Empreendedor:</strong>
              <span>{empreendimento.nomeEmpreendedor}</span>
            </div>
          </div>
          <div className="card-field">
            <span className="field-icon">📍</span>
            <div className="field-content">
              <strong>Município:</strong>
              <span>{empreendimento.municipio}</span>
            </div>
          </div>
          <div className="card-field">
            <span className="field-icon">🏢</span>
            <div className="field-content">
              <strong>Segmento:</strong>
              <span className="segmento-badge">{empreendimento.segmento}</span>
            </div>
          </div>
          <div className="card-field">
            <span className="field-icon">✉️</span>
            <div className="field-content">
              <strong>Contato:</strong>
              <a href={`mailto:${empreendimento.emailContato}`} className="contact-link">
                {empreendimento.emailContato}
              </a>
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-edit" onClick={handleEdit} aria-label="Editar empreendimento">
            ✏️ Editar
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeleteClick}
            disabled={deleteMutation.isLoading}
            aria-label="Excluir empreendimento"
          >
            {deleteMutation.isLoading ? '⏳ Excluindo...' : '🗑️ Excluir'}
          </button>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o empreendimento "${empreendimento.nomeEmpreendimento}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        type="danger"
      />
    </>
  );
};
