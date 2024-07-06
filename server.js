const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let grid = Array(20).fill().map(() => Array(20).fill('#FFFFFF'));

app.get('/api/grid', (req, res) => {
  res.json(grid);
});

app.post('/api/pixel', (req, res) => {
  const { x, y, color } = req.body;
  if (x >= 0 && x < 20 && y >= 0 && y < 20) {
    grid[y][x] = color;
    io.emit('pixelUpdate', { x, y, color });
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));