import Post from '../models/Post';
import Friends from '../schemas/Friend';

class PostController {
  async index(req, res) {
    const friends = await Friends.findOne({ user_id: req.userId });

    let users = [req.userId];

    // Get all friends and own user_id.
    if (friends && friends.friend_list) {
      users = [...users, ...friends.friend_list];
    }

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
            {
              association: 'user',
              attributes: ['id', 'first_name', 'last_name', 'avatar_id'],
              include: [
                {
                  association: 'avatar',
                  attributes: ['url', 'path'],
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

    const { id } = await Post.create({ user_id: req.userId, content, likes: [] });

    const post = await Post.findByPk(id, {
      include: [
        {
          association: 'comments',
          include: [
            {
              association: 'user',
            },
          ],
        },
        {
          association: 'user',
          attributes: ['id', 'first_name', 'last_name', 'avatar_id'],
          include: [
            {
              association: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    })

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
