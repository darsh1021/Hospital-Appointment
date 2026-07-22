import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { registerQueueHandlers } from "./handlers/queueHandler.js";

let io: SocketServer | null = null;

/**
 * Initializes Socket.io attached to the HTTP server.
 */
export const initSocket = (server: HttpServer): SocketServer => {
    io = new SocketServer(server, {
        cors: {
            origin: true, // Matches request origin (useful for local dev with credentials)
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`Socket client connected: ${socket.id}`);

        registerQueueHandlers(io!, socket);

        socket.on("disconnect", () => {
            console.log(`Socket client disconnected: ${socket.id}`);
        });
    });

    return io;
};

/**
 * Gets the active socket.io server instance.
 */
export const getIO = (): SocketServer => {
    if (!io) {
        throw new Error("Socket.io is not initialized yet!");
    }
    return io;
};

/**
 * Utility function to emit a queue update to a specific doctor's room as well as globally.
 * @param doctorId The ID of the doctor whose queue changed
 * @param data Payload detailing the update
 */
export const emitQueueUpdate = (doctorId: number | string, data: any) => {
    if (io) {
        // Emit to the specific doctor's room (real-time doctor/reception dashboards)
        io.to(`doctor-${doctorId}`).emit("queue:update", data);
        // Also emit globally for general queue tickers
        io.emit("queue:update", { doctor_id: doctorId, ...data });
    }
};
