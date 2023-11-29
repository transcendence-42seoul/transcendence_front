import * as ioClient from 'socket.io-client';
import cookie from 'js-cookie';

const token = cookie.get('token');

export const gameSocket = ioClient.io(
  `${import.meta.env.VITE_SERVER_URL}/gameGateway`,
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

export const gameSocketConnect = () => {
  if (gameSocket.disconnected) {
    gameSocket.connect();
  }
};

export const gameSocketDisconnect = () => {
  if (!gameSocket.disconnected) {
    gameSocket.disconnect();
  }
};

export const settingGameState = () => {
  gameSocketConnect();
  gameSocket.on('error', () => {});
};
