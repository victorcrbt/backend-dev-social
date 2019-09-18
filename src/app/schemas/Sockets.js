import mongoose from 'mongoose';

const SocketSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
  },
  socket_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Socket', SocketSchema);
