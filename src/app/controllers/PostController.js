import Post from '../models/Post';
import Friends from '../schemas/Friend';

class PostController {
  async index(req, res) {
    const { friend_list } = await Friends.findOne({ user_id: req.userId });

    // Get all friends and own user_id.
    const users = [...friend_list, req.userId];

    /**
     * 'postList' is an array of array of posts.
     */
    const postList = await Promise.all(
      users.map(async user => {
        return Post.findAll({
          where: {
            user_id: user,
          },
          include: [
            {
              association: 'comments',
              include: [
                {
                  association: 'user',
                },
              ],
            },
          ],
        });
      })
    );

    /**
     * Iterate the 'postList' array, and then, iterate the array inside of it, pushing the object to the 'posts' array.
     */
    const posts = [];

    postList.map(userPost => {
      return userPost.map(post => posts.push(post));
    });

    /**
     * Sort the posts by date, bringin the newer ones first.
     */
    const postsSortedByDate = posts.sort((post1, post2) =>
      post1.createdAt < post2.createdAt ? 1 : -1
    );

    return res.status(200).json(postsSortedByDate);
  }

  async store(req, res) {
    const { content } = req.body;

    const post = await Post.create({ user_id: req.userId, content });

    return res.status(201).json(post);
  }

  async update(req, res) {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot edit another person post.' });
    }

    await post.update(req.body, { fields: ['content'] });

    return res.status(200).json(post);
  }

  async delete(req, res) {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot delete another person post.' });
    }

    await post.destroy();

    return res.status(200).json({ msg: 'Post deleted.' });
  }
}

export default new PostController();
