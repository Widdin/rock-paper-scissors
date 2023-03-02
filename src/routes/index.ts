import express from 'express';
import { create, status, join, move } from '../controllers/game';
import { checkParams } from '../middleware/index';

const router = express.Router();

router.post('/', checkParams(['name']), create);

router.get('/:id', checkParams(['id']), status);

router.post('/:id/join', checkParams(['id', 'name']), join);

router.post('/:id/move', checkParams(['id', 'name', 'move']), move);

export default router;
