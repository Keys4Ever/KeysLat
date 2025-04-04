import { Router } from 'express';
import { UrlController } from '../api/url/controller';
import { QuickUrlController } from '../api/quick-url/controller';
import authenticate from '../middleware/authenticate.middleware';

const router = Router();

// Rutas protegidas
router.get('/all', authenticate, UrlController.getUrls);
router.post('/create', authenticate, UrlController.createUrl);
router.put('/:urlId', authenticate, UrlController.updateUrl);
router.delete('/:urlId', authenticate, UrlController.deleteUrl);

// Rutas públicas (si fuera necesario)
// Nota: La ruta dinámica para obtener URL por shortUrl debe ir al final.
router.get('/:shortUrl', UrlController.getUrl);

router.post('/quick-short', QuickUrlController.createQuickUrl);


export default router;
