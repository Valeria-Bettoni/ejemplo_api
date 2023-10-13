import db from '../db/connection.js'
import { DataTypes } from 'sequelize'


const Usuario = db.define('Usuario', 
    {
        dni: { type: DataTypes.DOUBLE, primaryKey: true },
        name: { type: DataTypes.STRING },
        lastname: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING},
        telephone: { type: DataTypes.STRING},
        username: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        level: {type: DataTypes.INTEGER}
    },
    {
        tableName: 'usuarios', //la tabla real con la que se relaciona el modelo
        timestamps: false // desactiva las columnas createdAt y editedAt que se agregan por defecto
    }
)

export default Usuario;