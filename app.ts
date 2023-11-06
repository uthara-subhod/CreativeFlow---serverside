import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import adminRouter from './routes/adminRouter'
import moderatorRouter from './routes/moderatorRouter'
import { Socket } from 'socket.io';
import { authorize } from 'socketio-jwt';

import nocache = require('nocache');
dotenv.config();

export const userSockets = {}; // Map of user IDs to socket connections

function getUserIdFromSocket(socket) {
  // Assuming you send the user ID as a query parameter during the socket connection
  const userId = socket.handshake.query.userId;

  return userId || null; // Return the user ID if found, or null if not available
}


mongoose.set('strictQuery', false);

mongoose
.connect(process.env.DATABASE_URL as string, {})
.then(() => {
  console.log('Mongodb Connected');
})
.catch((err) => {
  console.error(err);
});

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
export const io = require('socket.io')(server, {
  transports: ['websocket'], 
  cors: {
    origin: '*', // Replace with your client's origin
    methods: ['GET', 'POST'],
  },
});


app.use(cors());
app.options('*', cors());
app.use(nocache())
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'The user is not authorized' });
  }
  
  if (err.name === 'ValidationError') {
    // validation error
    return res.status(401).json({ message: err.message });
  }
  
  // default to 500 server error
  return res.status(500).json(err);
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));

app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/moderator',moderatorRouter)

const documents = {};

io.use(authorize({
  secret: process.env.USER_SECRET as string,
  handshake: true,
}));


io.on('connection', (socket:Socket) => {
  const userId = getUserIdFromSocket(socket);

  if (userId) {
    console.log("user socket ", userId)
    userSockets[userId] = socket;
  }
  socket.on('disconnect', () => {

    delete userSockets[userId];
  });
});



server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

