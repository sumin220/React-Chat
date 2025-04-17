import { io, Socket } from 'socket.io-client';

const socket: Socket = io(process.env.REACT_APP_WS_URL as string, {
    autoConnect: false,
});

export const connectSocket = (token: string): void => {
    socket.io.opts.extraHeaders = {
        authorization: `Bearer ${token}`,
    };
    socket.connect();
};

export const disconnectSocket = (): void => {
    socket.disconnect();
};

export default socket;