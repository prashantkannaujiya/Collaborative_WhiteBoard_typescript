const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('join',(data)=>{
      socket.join(data.room)
      console.log('joined'+data.room)
      socketIO.in(data.room).emit('Loggedin',data.room)
    })
    socket.on('drawing', (data) => {
       console.log(data)
        socketIO.in(data.room).emit('messageResponse', data.draw)
      });
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});