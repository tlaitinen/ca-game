import express from 'express';

const app = express();
const http = require('http').createServer(app);

app.get('/', (_req, res) => {
  res.send('<h1>Hello world</h1>');
});

const port = parseInt(process.env.PORT || '5000');
http.listen(port, () => {
  console.log('listening on *:' + port);
});
