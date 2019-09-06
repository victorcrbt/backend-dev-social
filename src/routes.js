import { Router } from 'express';
import multer from 'multer';

import { avatarUploadConfig, imageUploadConfig } from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import FriendController from './app/controllers/FriendController';
import SessionController from './app/controllers/SessionController';
import AvatarController from './app/controllers/AvatarController';

const routes = new Router();
const avatarUpload = multer(avatarUploadConfig);
const imageUpload = multer(imageUploadConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// Protected routes
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);

routes.post('/users/:id/friend', FriendController.store);
routes.delete('/users/:id/unfriend', FriendController.delete);

routes.post('/avatars', avatarUpload.single('file'), AvatarController.store);
routes.post('/images', imageUpload.single('file'), AvatarController.store);

export default routes;
