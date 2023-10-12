import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

//Crear instancia de sequelize
const db = new Sequelize(
    process.env.DB_NAME, // DB Name
    process.env.DB_USERNAME, // Username
    process.env.DB_PASSWORD, //Password
    {
        host: process.env.DB_HOSTNAME,
        dialect: process.env.DB_DIALECT,
        logging: true // Informa las interacciones de ORM con DB en la terminal
    })

export default db;