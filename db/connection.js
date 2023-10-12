import { Sequelize } from "sequelize";

//Crear instancia de sequelize

const db = new Sequelize(
    'qiyztglf', // DB Name
    'qiyztglf', // Username
    'NmipEoG6wXI6OIZTUuqIf9IvXoBQhYm1', //Password
    {
        host: 'silly.db.elephantsql.com',
        dialect: 'postgresql',
        logging: true // Informa las interacciones de ORM con DB en la terminal
    })

export default db;