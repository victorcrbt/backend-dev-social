import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

// Protected routes
routes.get('/', authMiddleware, (req, res) => {
  return res.status(200).json({ ok: true });
});

export default routes;
