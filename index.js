import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'
import list from './services/list.js'
import select from './services/select.js'
import add from './services/add.js'
import update from './services/update.js'
import remove from './services/remove.js'
import getInfo from './services/getInfo.js'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

app.get('/productos/', async (req, res) =>{
    list(Producto, res);
})

/* 10) Request GET para obtener la sumatoria de los precios individuales de los productos */
app.get('/productos/precio_total', async (req, res) => {
    try {
        const productos = await Producto.findAll()

        const cantidadDeProductos = productos.length
        let precioTotalProductos = 0

        for (const producto of productos){
            precioTotalProductos += producto.precio
        } 

        res.status(200).json({
            "Cantidad de productos": cantidadDeProductos, 
            "Precio Total de Productos": precioTotalProductos.toFixed(2)
        })
   
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.get('/productos/:id', async (req, res) => {
   select(Producto, req.params.id, res);
})

app.post('/productos', (req, res) => {
    add(req, Producto, res);
})

/* 1) Request GET para devolver todos los usuarios */ 
app.get('/usuarios/', async (req, res) => {
    list(Usuario, res);
})

/* 2) Request GET para devolver un usuario específico */
app.get('/usuarios/:id', async (req, res) => {
    select(Usuario, req.params.id, res)
})

/* 6) Request GET para obtener el precio de un producto que se indica por id */
app.get('/productos/:id/precio', async (req, res) => {
    getInfo(Producto, req.params.id, 'precio', res);
})

/* 7) Request GET para obtener el nombre de un producto que se indica por ID */
app.get('/productos/:id/nombre', async (req, res) => {
    getInfo(Producto, req.params.id, 'nombre', res);

})

/* 8) Request GET para obtener el teéfono de un usuario que se indica por ID */
app.get('/usuarios/:id/telefono', async (req, res) => {
    getInfo(Usuario, req.params.id, 'telefono', res);
})

/* 9) Request GET para obtener el nombre de un usuario que se indica por ID */
app.get('/usuarios/:id/nombre', async (req, res) => {
    getInfo(Usuario, req.params.id, 'nombre', res);
})

/* 3) Request POST para agregar un nuevo usuario*/ 
app.post('/usuarios', (req, res) => {
    add(req, Usuario, res);
})

app.patch('/productos/:id', async (req, res) => {
    update(req, Producto, req.params.id, res);

})

/* 4) Request PATCH para actualizar un dato de un usuario */
app.patch('/usuarios/:id', async (req, res) => {
    update(req, Usuario, req.params.id, res);
})

app.delete('/productos/:id', async (req, res) => {
    remove(Producto, req.params.id, res);
})

/* 5) Request DELETE para borrar un usuario de los datos */
app.delete('/usuarios/:id', async (req, res) => {
    remove(Usuario, req.params.id, res);
})

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

try {
    await db.authenticate()
    console.log('Conexion con la DDBB establecida.')
} catch (error) {
    console.log('Error de conexion db')
}

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})




