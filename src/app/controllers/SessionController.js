import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!(await userExists.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { id, first_name, last_name } = userExists;

    const token = jwt.sign(
      { id, first_name, last_name, email },
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .json({ token, user: { id, first_name, last_name, email } });
  }
}

export default new SessionController();
