import Post from '../models/Post';
import Comment from '../models/Comment';

class CommentController {
  async store(req, res) {
    const { content } = req.body;
    const { postId: post_id } = req.params;
    const { userId: user_id } = req;

    const postExists = await Post.findByPk(post_id);

    if (!postExists) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    try {
      const comment = await Comment.create({ content, user_id, post_id });

      return res.status(201).json(comment);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async update(req, res) {
    const { commentId: id } = req.params;
    const { userId: user_id } = req;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'You cannot edit another person comment.' });
    }

    try {
      await comment.update(req.body, { fields: ['content'] });

      return res.status(200).json(comment);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async delete(req, res) {
    const { userId: user_id } = req;
    const { commentId: id } = req.params;

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (comment.user_id !== user_id) {
      return res
        .status(401)
        .json({ error: 'You cannot delete another person comment.' });
    }

    try {
      await comment.destroy();

      return res.status(200).json();
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new CommentController();
