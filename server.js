const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Nie znaleziono pliku');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Nie znaleziono pliku');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.end(data);
    });
  } else {
    res.writeHead(200);
    res.end();
  }
});

const io = socketIo(server);

io.on('connection', (socket) => {
  const userId = 'user_' + Math.floor(Math.random() * 10000);

  socket.emit('chatMessage', {
    from: '[Server]',
    text: 'Witaj, ' + userId
  });

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', {
      from: userId,
      text: msg
    });
  });
});

server.listen(3000, () => {
  console.log('Serwer na porcie 3000');
});