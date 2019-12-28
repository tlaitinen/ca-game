import express from 'express';
import path from 'path';
import http from 'http';
import socketIo from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = socketIo(http);

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const port = parseInt(process.env.PORT || '5000');
server.listen(port, () => {
  console.log('listening on *:' + port);
});

io.on('connection', socket => {
  console.log('a user connected', socket);
});
