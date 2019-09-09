import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const userExists = await User.findOne({
      where: { email },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          association: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    if (!userExists) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!(await userExists.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    userExists.password_hash = undefined;

    const { id, first_name, last_name } = userExists;

    const token = jwt.sign(
      { id, first_name, last_name, email },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ token, user: userExists });
  }
}

export default new SessionController();
