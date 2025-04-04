import { Router } from 'express';
import urlRoutes from './url.routes';
import tagRoutes from './tag.routes';
import quickRoutes from './quick.routes';
import authRoutes from '../api/auth/routes';

const router = Router();

router.use('/url', urlRoutes);
router.use('/tags', tagRoutes);
router.use('/user', quickRoutes);
router.use('/auth', authRoutes)

export default router;
