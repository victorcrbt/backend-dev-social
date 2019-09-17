import io from 'socket.io';
import server from './app';

const SocketIo = io(server);

SocketIo.on('connect', socket => {
  console.log('connection', socket.id);

  setTimeout(() => {
    socket.emit('test', { message: 'test' });
  }, 1000);

  socket.on('test', data => console.log(data));
});

server.listen(3333);
