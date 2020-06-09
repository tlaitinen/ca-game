import express from 'express';
import path from 'path';
import http from 'http';
import socketIo from 'socket.io';
import { Server } from './Server';
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const port = parseInt(process.env.PORT || '5000');
const state = new Server();

io.on('connection', socket => {
  console.log('user connected', socket.id);
  state.addConnection(socket.id, message =>
    socket.emit(message.type, message.payload)
  );
  socket.on('disconnect', function() {
    console.log('user disconnected', socket.id);
    state.removeConnection(socket.id);
  });
  socket.on('input', msg => {
    state.handleInput(socket.id, msg);
  });
});
server.listen(port, () => {
  console.log('listening on *:' + port);
});

setInterval(() => state.update(), 5);
setInterval(() => state.broadcastAllGames(), 1000);
