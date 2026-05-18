import { Router } from 'express';
import { body } from 'express-validator';
import * as leadController from '../controllers/lead.controller';
import { authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('source').notEmpty(),
  leadController.createLead
);

router.get('/', leadController.getLeads);

router.get('/export/csv', leadController.exportLeadsCSV);

router.get('/:id', leadController.getLead);

router.put('/:id',
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  leadController.updateLead
);

router.delete('/:id', leadController.deleteLead);

export default router;
