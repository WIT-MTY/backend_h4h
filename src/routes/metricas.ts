import { Router } from 'express';
import * as MetricaController from '../controllers/metricas.js';
import { protectRoute } from '../middlewares/auth.js';

const router = Router();

router.use(protectRoute);

router.get(
    '/seccion1',
    MetricaController.getMetricaSeccion1,
);

router.get(
    '/seccion3',
    MetricaController.getMetricaSeccion3,
);

export default router;