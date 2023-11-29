import * as ioClient from 'socket.io-client';
import cookie from 'js-cookie';

const token = cookie.get('token');

export const appSocket = ioClient.io(
  `${import.meta.env.VITE_SERVER_URL}/appGateway`,
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
    query: {
      token,
    },
  },
);

export const appSocketConnect = () => {
  if (appSocket.disconnected) {
    appSocket.connect();
  }
};

export const appSocketDisconnect = () => {
  if (!appSocket.disconnected) {
    appSocket.disconnect();
  }
};
