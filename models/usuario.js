import db from '../db/connection.js'
import { DataTypes } from 'sequelize'


const Usuario = db.define('Usuario', 
    {
        dni: { type: DataTypes.DOUBLE, primaryKey: true },
        nombre: { type: DataTypes.STRING },
        apellido: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING},
        telefono: { type: DataTypes.STRING}
    },
    {
        tableName: 'usuarios', //la tabla real con la que se relaciona el modelo
        timestamps: false // desactiva las columnas createdAt y editedAt que se agregan por defecto
    }
    )

export default Usuario;