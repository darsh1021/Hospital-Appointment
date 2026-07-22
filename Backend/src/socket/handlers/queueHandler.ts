import { Server, Socket } from "socket.io";

/**
 * Registers events related to queue rooms and real-time updates.
 */
export const registerQueueHandlers = (io: Server, socket: Socket) => {
    // Clients (e.g., patient app tracking details or doctor screen) can subscribe to a specific doctor's room
    socket.on("queue:join-room", (doctorId: string | number) => {
        const roomName = `doctor-${doctorId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    socket.on("queue:leave-room", (doctorId: string | number) => {
        const roomName = `doctor-${doctorId}`;
        socket.leave(roomName);
        console.log(`Socket ${socket.id} left room ${roomName}`);
    });
};
