import { Router } from 'express';
import { QuickUrlController } from '../api/quick-url/controller';
import authenticate from '../middleware/authenticate.middleware';

const router = Router();

router.post('/add-secret', authenticate, QuickUrlController.connectQuickUrl);

export default router;
