import { Op } from 'sequelize';

import User from '../models/User';
import Friend from '../schemas/Friend';

class UserController {
  async index(req, res) {
    const where = {};

    if (req.query.user) {
      where[Op.or] = [
        {
          first_name: { [Op.iLike]: `%${req.query.user}%` },
        },
        {
          last_name: { [Op.iLike]: `%${req.query.user}%` },
        },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: {
        exclude: ['password_hash', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          association: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    const currentUserIndex = users.findIndex(user => user.id === req.userId);

    if (currentUserIndex !== -1) {
      users.splice(currentUserIndex, 1);
    }

    return res.status(200).json(users);
  }

  async show(req, res) {
    const { userId } = req;
    const { id } = req.params;

    const loggedFriendList = await Friend.findOne({ user_id: userId });
    const targetFriendList = await Friend.findOne({ user_id: id });

    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password_hash', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          association: 'avatar',
          attributes: ['path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.dataValues.friend_status = await user.checkFriendStatus(
      loggedFriendList,
      targetFriendList,
      userId,
      id
    );

    return res.status(200).json(user);
  }

  async store(req, res) {
    const emailAlreadyUsed = await User.findOne({
      where: { email: req.body.email },
    });

    if (emailAlreadyUsed) {
      return res.status(400).json({ error: 'The email is already used.' });
    }

    const phoneAlreadyUsed = await User.findOne({
      where: { phone: req.body.phone },
    });

    if (req.body.phone !== '' && phoneAlreadyUsed) {
      return res
        .status(400)
        .json({ error: 'The phone number is already used.' });
    }

    try {
      const user = await User.create(req.body);

      return res.status(201).json(user);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async update(req, res) {
    const { email, oldPassword, password, phone } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (email && email !== user.email) {
      const emailAlreadyUsed = await User.findOne({ where: { email } });

      if (emailAlreadyUsed) {
        return res.status(400).json({ error: 'The email is already used.' });
      }
    }

    if (phone !== '' && phone && phone !== user.phone) {
      const phoneAlreadyUsed = await User.findOne({ where: { phone } });

      if (phoneAlreadyUsed) {
        return res.status(400).json({ error: 'The phone is already used.' });
      }
    }

    if (password && !oldPassword) {
      return res.status(401).json({
        error: 'You must provide your old password to update your password.',
      });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Your old password do not match.' });
    }

    await user.update(req.body);

    const updatedUser = await User.findByPk(req.userId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password_hash'],
      },
      include: [
        {
          association: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json(updatedUser);
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!req.body.password) {
      return res.status(401).json({
        error: 'You must provide your password to procceed with this action.',
      });
    }

    if (!(await user.checkPassword(req.body.password))) {
      return res
        .status(401)
        .json({ error: 'The provided password it is no correct.' });
    }

    await user.destroy();

    return res.status(200).json();
  }
}

export default new UserController();
