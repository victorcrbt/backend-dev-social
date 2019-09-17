import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import { resolve } from 'path';
import { createServer } from 'http';
import io from 'socket.io';

import Socket from './app/schemas/Sockets';

import './database';
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.websocket(this.server);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  websocket(server) {
    this.socket = io(server);

    this.socket.on('connect', async socket => {
      const { user_id } = socket.handshake.query;

      await Socket.findOneAndUpdate(
        { user_id },
        { socket_id: socket.id },
        { upsert: true }
      );
    });
  }

  middlewares() {
    this.app.use((req, res, next) => {
      req.socket = this.socket;

      next();
    });

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(
      '/static/avatars',
      express.static(resolve(__dirname, '..', 'temp', 'avatars'))
    );
  }

  routes() {
    this.app.use(routes);
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Interal server error.' });
    });
  }
}

export default new App().server;
