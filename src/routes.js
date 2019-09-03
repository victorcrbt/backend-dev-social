import { Router } from 'express';

import User from './app/models/User';

const routes = new Router();

routes.post('/', async (req, res) => {
  const data = {
    first_name: 'Victor',
    last_name: 'Batalha',
    email: 'madivcb@gmail.com',
    phone: '51998588292',
    password: '123456',
  };

  const user = await User.create(data);

  return res.status(201).json(user);
});

export default routes;
