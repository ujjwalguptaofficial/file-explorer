import { Sequelize } from "sequelize-typescript";
import { File } from "@/database/models/file";

export function initDatabase() {
    const dbHost = process.env.DB_HOST || 'localhost';
    console.log("dbHost", dbHost);
    const dbPort = process.env.DB_PORT;
    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: dbHost,
        port: dbPort ? Number(dbPort) : 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'adaline',
        logging: process.env.NODE_ENV === 'development'
    });

    sequelize.addModels([
        File
    ]);

    return sequelize.sync();
}
