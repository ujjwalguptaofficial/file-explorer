import * as path from "path";
import { Fort } from "fortjs";
import { routes } from "@/routes";
import { initDatabase } from "./database";
import dotenv from 'dotenv';
import { CorsWall } from "./walls/cors_wall";
import { socket } from "./websocket";
dotenv.config();

export const createApp = async () => {
    Fort.folders = [{
        alias: "/",
        path: path.join(__dirname, "../static")
    }];
    Fort.walls = [CorsWall];
    Fort.routes = routes;

    await initDatabase();
    await Fort.create();
    await socket.init();
    process.env.APP_URL = `http://localhost:${Fort.port}`;
};
if (process.env.NODE_ENV !== "test") {
    createApp().then(() => {
        Fort.logger.debug(`Your fort has been forged and is now ready for exploration at ${process.env.APP_URL}`);
    }).catch(err => {
        console.error(err);
    });
}

