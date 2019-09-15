import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Avatar, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  checkFriendStatus(
    loggedFriendList,
    targetFriendList,
    loggedUser,
    targetUser
  ) {
    targetUser = Number(targetUser);

    let loggedAddedTarget = false;
    let targetAddedLogged = false;

    if (loggedFriendList) {
      loggedAddedTarget = loggedFriendList.friend_list.includes(targetUser);
    }

    if (targetFriendList) {
      targetAddedLogged = targetFriendList.friend_list.includes(loggedUser);
    }

    if (loggedAddedTarget && !targetAddedLogged) {
      return 'request sent';
    }

    if (!loggedAddedTarget && targetAddedLogged) {
      return 'request received';
    }

    if (loggedAddedTarget && targetAddedLogged) {
      return 'friends';
    }

    return 'not friends';
  }
}

export default User;
