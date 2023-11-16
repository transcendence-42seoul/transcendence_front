import * as ioClient from 'socket.io-client';

export const gameSocket = ioClient.io(`${import.meta.env.VITE_SERVER_URL}/games`, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ['websocket'],
});

export const gameSocketConnect = () => {
  if (gameSocket.disconnected) {
    gameSocket.connect();
  }
};
