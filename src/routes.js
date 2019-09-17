import { Router } from 'express';
import multer from 'multer';

import { avatarUploadConfig, imageUploadConfig } from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import FriendController from './app/controllers/FriendController';
import SessionController from './app/controllers/SessionController';
import AvatarController from './app/controllers/AvatarController';
import PostController from './app/controllers/PostController';
import LikeController from './app/controllers/LikeController';
import CommentController from './app/controllers/CommentController';
import MessageController from './app/controllers/MessageController';

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

routes.get('/friends', FriendController.index);
routes.post('/users/:id/friend', FriendController.store);
routes.delete('/users/:id/unfriend', FriendController.delete);

routes.get('/posts', PostController.index);
routes.post('/posts', PostController.store);
routes.put('/posts/:postId', PostController.update);
routes.delete('/posts/:postId', PostController.delete);

routes.get('/likes/:postId', LikeController.index);
routes.post('/posts/:postId/like', LikeController.store);
routes.delete('/posts/:postId/dislike', LikeController.delete);

routes.post('/posts/:postId/comment', CommentController.store);
routes.put('/comments/:commentId', CommentController.update);
routes.delete('/comments/:commentId', CommentController.delete);

routes.post('/messages', MessageController.store);
routes.get('/messages', MessageController.index);

routes.post('/avatars', avatarUpload.single('file'), AvatarController.store);
routes.post('/images', imageUpload.single('file'), AvatarController.store);

export default routes;
