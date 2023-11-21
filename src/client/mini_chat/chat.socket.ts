import * as ioClient from 'socket.io-client';

export const chatSocket = ioClient.io(
  `${import.meta.env.VITE_SERVER_URL}/chat`,
  {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket'],
  },
);

export const chatSocketConnect = () => {
  if (chatSocket.disconnected) {
    chatSocket.connect();
  }
};
