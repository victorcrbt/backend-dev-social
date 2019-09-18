import Friend from '../schemas/Friend';
import User from '../models/User';

class FriendController {
  async index(req, res) {
    const { userId: user_id } = req;

    const friends = await Friend.findOne({ user_id });

    return res.status(200).json(friends);
  }

  async store(req, res) {
    const loggedUser = req.userId;
    const targetUser = Number(req.params.id);

    if (loggedUser === targetUser) {
      return res
        .status(400)
        .json({ error: 'You cannot add yourself as a friend.' });
    }

    const targetUserExists = await User.findByPk(targetUser);

    if (!targetUserExists) {
      return res
        .status(404)
        .json({ error: 'The requested user does not exist.' });
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
    const loggedUserId = req.userId;
    const targetUserId = Number(req.params.id);

    async function removeFriendFromTargetUser(targetUser) {
      const targetFriendIndex = targetUser.friend_list.findIndex(
        friend => friend === loggedUserId
      );

      if (targetFriendIndex === -1) {
        return res.status(200).json();
      }

      targetUser.friend_list.splice(targetFriendIndex, 1);

      await targetUser.save();

      return res.status(200).json();
    }

    if (loggedUserId === targetUserId) {
      return res
        .status(400)
        .json({ error: 'You cannot add yourself as a friend.' });
    }

    const loggedUser = await Friend.findOne({ user_id: loggedUserId });

    if (!loggedUser) {
      return res
        .status(400)
        .json({ error: 'You currently do not have any friends.' });
    }

    const loggedFriendIndex = loggedUser.friend_list.findIndex(
      friend => friend === targetUserId
    );

    if (loggedFriendIndex === -1) {
      return res
        .status(400)
        .json({ error: 'You do not have this user added as a friend.' });
    }

    loggedUser.friend_list.splice(loggedFriendIndex, 1);

    await loggedUser.save();

    const targetUser = await Friend.findOne({ user_id: targetUserId });

    if (!targetUser) {
      return res.status(200).json();
    }

    removeFriendFromTargetUser(targetUser);

    return res.status(200).json();
  }
}

export default new FriendController();
