import User from '../models/User';

class UserController {
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

    if (phoneAlreadyUsed) {
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
}

export default new UserController();
