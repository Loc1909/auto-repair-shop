import { io } from "socket.io-client";

// Port 9092 là port của Socket.io Server trong Backend
const SOCKET_URL = "http://localhost:9092";

export const socket = io(SOCKET_URL, {
    autoConnect: false, // Không tự động kết nối khi vừa load file
    transports: ["websocket"], // Ưu tiên dùng websocket thuần
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
