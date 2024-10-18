import { Fort } from "fortjs";
import { Server } from "socket.io";

let io: Server;
const initSocketIo = () => {
    io = new Server(Fort.httpServer, {
        path: "/websocket",
        cors: {
            // origin: "http://localhost:8081, http://localhost:5173",
            origin: "*"
        },
    });

    io.on("connection", (socket) => {

        // TODO: auth based on cookie
        const { userId } = socket.handshake.auth;

        if (!userId) {
            socket.disconnect(true);
            return;
        }

        socket.data.userId = userId;
        // console.log("socket connected", userId);
        socket.join(userId.toString());

    });
}

const refreshPage = (userId: number, socketId?) => {
    io.in(userId.toString()).emit("refresh", {
        socketId
    });
}

export const socket = {
    refreshPage,
    browseFolder: (userId: number, folderId: string, socketId) => {
        io.in(userId.toString()).emit("browseFolder", {
            folderId,
            socketId
        });
    },
    init: initSocketIo,
    close() {
        io.disconnectSockets(true);
    }
}
