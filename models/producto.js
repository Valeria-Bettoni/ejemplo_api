import db from '../db/connection.js'
import { DataTypes } from 'sequelize'

// Porducto será la variable con la que trabajaremos, 'Producto' debe coincidir con el nombre de la tabla de la bd (con o sin s final)
const Producto = db.define('Producto', 
    {
        nombre: { type: DataTypes.STRING },
        tipo: { type: DataTypes.STRING},
        precio: { type: DataTypes.DOUBLE}
    },
    {
        tableName: 'productos', //la tabla real con la que se relaciona el modelo
        timestamps: false // desactiva las columnas createdAt y editedAt que se agregan por defecto
    }
    )

export default Producto;
