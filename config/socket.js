// socket.js
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend origin
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for worker location updates
  socket.on('workerLocation', ({ workerId, lat, lng }) => {
    // Broadcast worker location to user
    io.emit(`locationUpdate:${workerId}`, { lat, lng });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export default io;