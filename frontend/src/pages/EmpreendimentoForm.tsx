import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { empreendimentoService } from '../services/api';
import { CreateEmpreendimentoDto, SegmentoAtuacao, Status } from '../types/empreendimento';
import { useToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import './EmpreendimentoForm.css';

export const EmpreendimentoForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: empreendimento, isLoading } = useQuery(
    ['empreendimento', id],
    () => empreendimentoService.getById(id!),
    { enabled: isEditMode }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEmpreendimentoDto>({
    defaultValues: {
      status: Status.ATIVO,
    },
  });

  useEffect(() => {
    if (empreendimento) {
      reset({
        nomeEmpreendimento: empreendimento.nomeEmpreendimento,
        nomeEmpreendedor: empreendimento.nomeEmpreendedor,
        municipio: empreendimento.municipio,
        segmento: empreendimento.segmento,
        emailContato: empreendimento.emailContato,
        status: empreendimento.status,
      });
    }
  }, [empreendimento, reset]);

  const toast = useToastContext();

  const createMutation = useMutation(
    (data: CreateEmpreendimentoDto) => empreendimentoService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('empreendimentos');
        toast.success('Empreendimento cadastrado com sucesso!');
        navigate('/');
      },
      onError: () => {
        toast.error('Erro ao cadastrar empreendimento. Tente novamente.');
      },
    }
  );

  const updateMutation = useMutation(
    (data: CreateEmpreendimentoDto) => empreendimentoService.update(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('empreendimentos');
        toast.success('Empreendimento atualizado com sucesso!');
        navigate('/');
      },
      onError: () => {
        toast.error('Erro ao atualizar empreendimento. Tente novamente.');
      },
    }
  );

  const onSubmit = (data: CreateEmpreendimentoDto) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="large" message="Carregando dados do empreendimento..." />
      </div>
    );
  }

  return (
    <div className="empreendimento-form">
      <div className="form-header">
        <h2>{isEditMode ? 'Editar Empreendimento' : 'Novo Empreendimento'}</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="nomeEmpreendimento">
            Nome do Empreendimento <span className="required">*</span>
          </label>
          <input
            id="nomeEmpreendimento"
            type="text"
            {...register('nomeEmpreendimento', {
              required: 'Nome do empreendimento é obrigatório',
              maxLength: {
                value: 200,
                message: 'Nome não pode exceder 200 caracteres',
              },
            })}
            className={errors.nomeEmpreendimento ? 'error' : ''}
          />
          {errors.nomeEmpreendimento && (
            <span className="error-message">{errors.nomeEmpreendimento.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="nomeEmpreendedor">
            Nome do(a) Empreendedor(a) <span className="required">*</span>
          </label>
          <input
            id="nomeEmpreendedor"
            type="text"
            {...register('nomeEmpreendedor', {
              required: 'Nome do empreendedor é obrigatório',
              maxLength: {
                value: 200,
                message: 'Nome não pode exceder 200 caracteres',
              },
            })}
            className={errors.nomeEmpreendedor ? 'error' : ''}
          />
          {errors.nomeEmpreendedor && (
            <span className="error-message">{errors.nomeEmpreendedor.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="municipio">
            Município de Santa Catarina <span className="required">*</span>
          </label>
          <input
            id="municipio"
            type="text"
            {...register('municipio', {
              required: 'Município é obrigatório',
              maxLength: {
                value: 100,
                message: 'Município não pode exceder 100 caracteres',
              },
            })}
            className={errors.municipio ? 'error' : ''}
          />
          {errors.municipio && (
            <span className="error-message">{errors.municipio.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="segmento">
            Segmento de Atuação <span className="required">*</span>
          </label>
          <select
            id="segmento"
            {...register('segmento', {
              required: 'Segmento de atuação é obrigatório',
            })}
            className={errors.segmento ? 'error' : ''}
          >
            <option value="">Selecione um segmento</option>
            {Object.values(SegmentoAtuacao).map((segmento) => (
              <option key={segmento} value={segmento}>
                {segmento}
              </option>
            ))}
          </select>
          {errors.segmento && (
            <span className="error-message">{errors.segmento.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="emailContato">
            E-mail ou Meio de Contato <span className="required">*</span>
          </label>
          <input
            id="emailContato"
            type="text"
            {...register('emailContato', {
              required: 'E-mail ou meio de contato é obrigatório',
              maxLength: {
                value: 200,
                message: 'Contato não pode exceder 200 caracteres',
              },
            })}
            className={errors.emailContato ? 'error' : ''}
          />
          {errors.emailContato && (
            <span className="error-message">{errors.emailContato.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" {...register('status')}>
            <option value={Status.ATIVO}>Ativo</option>
            <option value={Status.INATIVO}>Inativo</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading
              ? 'Salvando...'
              : isEditMode
              ? 'Atualizar'
              : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};
