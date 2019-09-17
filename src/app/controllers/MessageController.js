import { Op } from 'sequelize';
import Message from '../models/Message';

class MessageController {
  async store(req, res) {
    const { userId: sender_id } = req;
    const { receiver_id, content } = req.body;

    if (sender_id === receiver_id)
      res.status(400).json({ error: 'You cannot send a message to yourself.' });

    try {
      const message = await Message.create({ sender_id, receiver_id, content });

      return res.status(201).json(message);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  async index(req, res) {
    const { userId: loggedUser } = req;
    const targetUser = Number(req.query.receiver_id);

    try {
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { sender_id: loggedUser, receiver_id: targetUser },
            { sender_id: targetUser, receiver_id: loggedUser },
          ],
        },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new MessageController();