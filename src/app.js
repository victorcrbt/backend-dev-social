import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import { resolve } from 'path';
import { createServer } from 'http';

import './database';
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
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
