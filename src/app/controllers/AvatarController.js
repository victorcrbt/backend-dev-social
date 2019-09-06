import Avatar from '../models/Avatar';

class AvatarController {
  async store(req, res) {
    const { filename: path, originalname: name } = req.file;

    const file = await Avatar.create({ path, name });

    return res.status(201).json({ file });
  }
}

export default new AvatarController();
