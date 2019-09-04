import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

// Protected routes
routes.put('/users', authMiddleware, UserController.update);
routes.delete('/users', authMiddleware, UserController.delete);

routes.post('/images', upload.single('file'), (req, res) => {
  return res.status(200).json();
});

export default routes;
