import express from 'express';
import path from 'path';
import http from 'http';
import socketIo from 'socket.io';
import { updateServerState, initialServerState } from './state';
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const port = parseInt(process.env.PORT || '5000');
io.on('connection', socket => {
  console.log('a user connected', socket.id);
  socket.on('disconnect', function() {
    console.log('user disconnected', socket.id);
  });
  socket.on('input', msg => {
    console.log(msg);
    io.emit('fuu', msg);
  });
});
server.listen(port, () => {
  console.log('listening on *:' + port);
});

const serverState = initialServerState;
setInterval(() => {
  updateServerState(serverState);
}, 16);
