import { body } from 'express-validator';
import { SegmentoAtuacao, Status } from '../models/Empreendimento.model';

export const createEmpreendimentoValidator = [
  body('nomeEmpreendimento')
    .trim()
    .notEmpty()
    .withMessage('Nome do empreendimento é obrigatório')
    .isLength({ max: 200 })
    .withMessage('Nome do empreendimento não pode exceder 200 caracteres'),
  
  body('nomeEmpreendedor')
    .trim()
    .notEmpty()
    .withMessage('Nome do empreendedor é obrigatório')
    .isLength({ max: 200 })
    .withMessage('Nome do empreendedor não pode exceder 200 caracteres'),
  
  body('municipio')
    .trim()
    .notEmpty()
    .withMessage('Município é obrigatório')
    .isLength({ max: 100 })
    .withMessage('Município não pode exceder 100 caracteres'),
  
  body('segmento')
    .notEmpty()
    .withMessage('Segmento de atuação é obrigatório')
    .isIn(Object.values(SegmentoAtuacao))
    .withMessage(`Segmento deve ser um dos seguintes: ${Object.values(SegmentoAtuacao).join(', ')}`),
  
  body('emailContato')
    .trim()
    .notEmpty()
    .withMessage('E-mail ou meio de contato é obrigatório')
    .isLength({ max: 200 })
    .withMessage('E-mail ou meio de contato não pode exceder 200 caracteres'),
  
  body('status')
    .optional()
    .isIn(Object.values(Status))
    .withMessage(`Status deve ser: ${Object.values(Status).join(' ou ')}`),
];

export const updateEmpreendimentoValidator = [
  body('nomeEmpreendimento')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nome do empreendimento não pode ser vazio')
    .isLength({ max: 200 })
    .withMessage('Nome do empreendimento não pode exceder 200 caracteres'),
  
  body('nomeEmpreendedor')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nome do empreendedor não pode ser vazio')
    .isLength({ max: 200 })
    .withMessage('Nome do empreendedor não pode exceder 200 caracteres'),
  
  body('municipio')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Município não pode ser vazio')
    .isLength({ max: 100 })
    .withMessage('Município não pode exceder 100 caracteres'),
  
  body('segmento')
    .optional()
    .isIn(Object.values(SegmentoAtuacao))
    .withMessage(`Segmento deve ser um dos seguintes: ${Object.values(SegmentoAtuacao).join(', ')}`),
  
  body('emailContato')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('E-mail ou meio de contato não pode ser vazio')
    .isLength({ max: 200 })
    .withMessage('E-mail ou meio de contato não pode exceder 200 caracteres'),
  
  body('status')
    .optional()
    .isIn(Object.values(Status))
    .withMessage(`Status deve ser: ${Object.values(Status).join(' ou ')}`),
];
