import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

app.get('/productos/', async (req, res) =>{
    try {
        let allProducts = await Producto.findAll()

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

// REVISAR LA SUMATORIA
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
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)

        res.status(200).json(productoEncontrado)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

app.post('/productos', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            // guardado del nuevo producto
            const productoNuevo = new Producto(req.body)
            await productoNuevo.save()
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 1) Request GET para devolver todos los usuarios */ 
app.get('/usuarios/', async (req, res) => {
    try {
        let allUsers = await Usuario.findAll()
        res.status(200).json(allUsers)
    } catch {
        res.status(204).json({"messagge" : error})
    }
})

/* 2) Request GET para devolver un usuario específico */
app.get('/usuarios/:id', async (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = await Usuario.findByPk(usuarioId)

        if (!usuarioEncontrado){
            res.status(204).json({ "message": "Usuario no encontrado"})
        }

        res.status(200).json(usuarioEncontrado)

    } catch(error){
        res.sendStatus(204).json({"messagge": error})
    }
})

/* 6) Request GET para obtener el precio de un producto que se indica por id */
app.get('/productos/:id/precio', async (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)

        if (!productoEncontrado) {
            res.status(204).json({"message": "Producto no encontrado"})
        }

        res.status(200).json(productoEncontrado.precio)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 7) Request GET para obtener el nombre de un producto que se indica por ID */
app.get('/productos/:id/nombre', async (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)

        if (!productoEncontrado) {
            res.status(204).json({"message": "Producto no encontrado"})
        }

        res.status(200).json(productoEncontrado.nombre)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 8) Request GET para obtener el teéfono de un usuario que se indica por ID */
app.get('/usuarios/:id/telefono', async (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = await Usuario.findByPk(usuarioId)

        if (!usuarioEncontrado) {
            res.status(204).json({"message": "Usuario no encontrado"})
        }

        res.status(200).json(usuarioEncontrado.telefono)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 9) Request GET para obtener el nombre de un usuario que se indica por ID */
app.get('/usuarios/:id/nombre', async (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = await Usuario.findByPk(usuarioId)

        if (!usuarioEncontrado) {
            res.status(204).json({"message": "Usuario no encontrado"})
        }

        res.status(200).json(usuarioEncontrado.nombre)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 3) Request POST para agregar un nuevo usuario*/ 
app.post('/usuarios', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            
            const usuarioNuevo = new Usuario(req.body)
            await usuarioNuevo.save()
        })

        res.status(201).json({"messagge":"success"})

    } catch (error) {
        res.status(204).json({"messagge":"error"})
    }
})


app.patch('/productos/:id', async (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    try {
        let productoAActualizar = await Producto.findByPk(idProductoAEditar)

        if (!productoAActualizar) {
            return res.status(204).json({"mensage":"Producto no encontrado"})
        }

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        }) 

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            await productoAActualizar.update(req.body)
            res.status(200).send('Producto actualizado')
        })
    } catch (error) {
        res.status(204).json({"message": "Producto no encontrado"})
    }
})

/* 4) Request PATCH para actualizar un dato de un usuario */
app.patch('/usuarios/:id', async (req, res) => {
    let idUsuarioAEditar = parseInt(req.params.id)
    try {
        let usuarioAActualizar = await Usuarioo.findByPk(idUsuarioAEditar)

        if (!usuarioAActualizar) {
            return res.status(204).json({"mensage":"Usuario no encontrado"})
        }

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        }) 

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            await usuarioAActualizar.update(req.body)
            res.status(200).send('Usuario actualizado')
        })
    } catch (error) {
        res.status(204).json({"message": "Usuario no encontrado"})
    }
})

app.delete('/productos/:id', async (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)

    try {
        let productoABorrar = await Producto.findByPk(idProductoABorrar)

        if (!productoABorrar) {
            return res.status(204).json({"message": "Producto no encontrado"})
        }
        await idProductoABorrar.destroy()
        res.status(200).json({"message": "Producto borrado"})

    } catch (error) {
        res.status(204).json({message: Error})
    }
})


/* 5) Request DELETE para borrar un usuario de los datos */
app.delete('/usuarios/:id', async (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id)

    try {
        let usuarioABorrar = await Producto.findByPk(idUsuarioABorrar)

        if (!usuarioABorrar) {
            return res.status(204).json({"message": "Usuario no encontrado"})
        }
        await idUsuarioABorrar.destroy()
        res.status(200).json({"message": "Usuario borrado"})

    } catch (error) {
        res.status(204).json({message: Error})
    }
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




