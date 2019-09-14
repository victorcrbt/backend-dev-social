import Post from '../models/Post';

class LikeController {
  async index(req, res) {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    return res.status(200).json({ likes: post.likes });
  }

  async store(req, res) {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (!post.likes) {
      post.likes = [req.userId];

      await post.save();

      return res.status(200).json(post);
    }

    const alreadyLiked = post.likes.find(user => user === req.userId);

    if (alreadyLiked) {
      return res.status(400).json({ error: 'You cannot like a post twice.' });
    }

    post.likes = [...post.likes, req.userId];

    await post.save();

    return res.status(200).json(post);
  }

  async delete(req, res) {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (!post.likes)
      return res
        .status(200)
        .json({ msg: 'This post does not have any like yet.' });

    const userIndex = post.likes.findIndex(user => user === req.userId);

    if (userIndex === -1) {
      return res
        .status(400)
        .json({ error: 'You cannot dislike a post that you did not like.' });
    }

    post.likes.splice(userIndex, 1);

    post.likes = [...post.likes];

    await post.save();

    return res.status(200).json(post);
  }
}

export default new LikeController();
