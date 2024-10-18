import { io, Socket } from "socket.io-client";
import { FileService } from "./file_service";

class Service {

    file!: FileService
    baseUrl!: string

    init(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.file = new FileService(
            baseUrl
        )
        this.socket = io(this.baseUrl, {
            autoConnect: true,
            path: '/websocket',
            transports: ['websocket', 'polling'],
        });
    }

    socket!: Socket;

    connectSocket() {
        const socket = this.socket;
        socket.auth = { userId: 1 };
        return socket.connect();
    }
}

export const service = new Service();
