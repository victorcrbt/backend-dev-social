import { Router } from 'express';
import multer from 'multer';

import { avatarUploadConfig, imageUploadConfig } from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import AvatarController from './app/controllers/AvatarController';

const routes = new Router();
const avatarUpload = multer(avatarUploadConfig);
const imageUpload = multer(imageUploadConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

// Protected routes
routes.put('/users', authMiddleware, UserController.update);
routes.delete('/users', authMiddleware, UserController.delete);

routes.post('/avatars', avatarUpload.single('file'), AvatarController.store);
routes.post('/images', imageUpload.single('file'), AvatarController.store);

export default routes;
