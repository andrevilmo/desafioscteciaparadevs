import { Router } from 'express';
import { EmpreendimentoController } from '../controllers/Empreendimento.controller';
import { createEmpreendimentoValidator, updateEmpreendimentoValidator } from '../validators/empreendimento.validator';
import { validate } from '../middleware/validation';

const router = Router();
const controller = new EmpreendimentoController();

router.post('/', validate(createEmpreendimentoValidator), controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.put('/:id', validate(updateEmpreendimentoValidator), controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export { router as empreendimentoRoutes };
