import Friend from '../schemas/Friend';

class FriendController {
  async store(req, res) {
    const loggedUser = req.userId;
    const targetUser = Number(req.params.id);

    if (loggedUser === targetUser) {
      return res
        .status(400)
        .json({ error: 'You cannot add yourself as a friend.' });
    }

    let user = await Friend.findOne({ user_id: loggedUser });

    if (!user) {
      user = await Friend.create({ user_id: loggedUser });
    }

    const alreadyFriend = user.friend_list.find(
      friend => friend === targetUser
    );

    if (alreadyFriend) {
      return res
        .status(400)
        .json({ error: 'You already added this user as a friend.' });
    }

    user.friend_list.push(targetUser);

    user.save();

    return res.status(200).json(user);
  }

  async delete(req, res) {
    const loggedUser = req.userId;
    const targetUser = Number(req.params.id);

    if (loggedUser === targetUser) {
      return res
        .status(400)
        .json({ error: 'You cannot add yourself as a friend.' });
    }

    const user = await Friend.findOne({ user_id: loggedUser });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'You currently do not have any friends.' });
    }

    const friendIndex = user.friend_list.findIndex(
      friend => friend === targetUser
    );

    if (friendIndex === -1) {
      return res
        .status(400)
        .json({ error: 'You do not have this user added as a friend.' });
    }

    user.friend_list.splice(friendIndex, 1);

    user.save();

    return res.status(200).json(user);
  }
}

export default new FriendController();
