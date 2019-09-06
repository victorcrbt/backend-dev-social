import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },
  friend_list: [Number],
});

export default mongoose.model('Friend', FriendSchema);
