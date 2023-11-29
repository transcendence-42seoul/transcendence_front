import * as ioClient from 'socket.io-client';
import { getCookie } from '../../common/cookie/cookie';

const token = getCookie('token');

export const chatSocket = ioClient.io(
  `${import.meta.env.VITE_SERVER_URL}/chats`,
  {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    transports: ['websocket'],
    auth: {
      token,
    },
    // path: '/chats',
  },
);

export const chatSocketConnect = () => {
  if (!chatSocket.connected) {
    chatSocket.io.opts.query = { token };

    chatSocket.connect();
  }

  chatSocket.on('connect', () => {
    console.log('Connected to chat server');
  });

  chatSocket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
};

export const chatSocketLeave = () => {
  if (chatSocket.connected) {
    console.log('disconnecting from chat server');
    chatSocket.disconnect();
  }
};
