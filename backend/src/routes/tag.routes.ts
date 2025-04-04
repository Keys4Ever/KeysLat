import { Router } from 'express';
import { TagController } from '../api/tag/controller';
import authenticate from '../middleware/authenticate.middleware';

const router = Router();

// Todas las rutas de tags requieren autenticación

router.post('/', authenticate, TagController.createTag);
router.get('/', authenticate, TagController.getUserTags);
router.put('/:id', authenticate, TagController.updateTag);
router.delete('/:id', authenticate, TagController.deleteTag);
router.post('/:tagId/urls/:urlId', authenticate, TagController.associateTagToUrl);

export default router;
