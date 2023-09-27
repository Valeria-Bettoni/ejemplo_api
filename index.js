import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

import express from 'express'
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

app.get('/productos/', (req, res) =>{
    try {
        let allProducts = datos.productos

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({"message": error})
    }
})

/* 10) Request GET para obtener la sumatoria de los precios individuales de los productos */
app.get('/productos/precio_total', (req, res) => {
    try {
        const cantidadDeProductos = datos.productos.length
        let precioTotalProductos = 0

        for (const producto of datos.productos){
            precioTotalProductos += producto.precio
        } 

        res.status(200).json({"Cantidad de productos": cantidadDeProductos, "Precio Total de Productos": precioTotalProductos})
   
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

app.get('/productos/:id', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

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
    
        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.productos.push(req.body)
        })
    
        res.status(201).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 1) Request GET para devolver todos los usuarios */ 
app.get('/usuarios/', (req, res) => {
    try {
        let allUsers = datos.usuarios
        res.status(200).json(allUsers)
    } catch {
        res.status(204).json({"messagge" : error})
    }
})

/* 2) Request GET para devolver un usuario específico */
app.get('/usuarios/:id', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

        if (!usuarioEncontrado){
            res.status(204).json({ "message": "Usuario no encontrado"})
        }

        res.status(200).json(usuarioEncontrado)

    } catch(error){
        res.sendStatus(204).json({"messagge": error})
    }
})

/* 6) Request GET para obtener el precio de un producto que se indica por id */
app.get('/productos/:id/precio', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (!productoEncontrado) {
            res.status(204).json({"message": "Producto no encontrado"})
        }

        res.status(200).json(productoEncontrado.precio)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 7) Request GET para obtener el nombre de un producto que se indica por ID */
app.get('/productos/:id/nombre', (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

        if (!productoEncontrado) {
            res.status(204).json({"message": "Producto no encontrado"})
        }

        res.status(200).json(productoEncontrado.nombre)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 8) Request GET para obtener el teéfono de un usuario que se indica por ID */
app.get('/usuarios/:id/telefono', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

        if (!usuarioEncontrado) {
            res.status(204).json({"message": "Usuario no encontrado"})
        }

        res.status(200).json(usuarioEncontrado.telefono)
    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})

/* 9) Request GET para obtener el nombre de un usuario que se indica por ID */
app.get('/usuarios/:id/nombre', (req, res) => {
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)

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

        req.on('end', () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            datos.usuarios.push(req.body)
        })

        res.status(201).json({"messagge":"success"})

    } catch (error) {
        res.status(204).json({"messagge":"error"})
    }
})


app.patch('/productos/:id', (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

    if (!productoAActualizar) {
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data
        
        if(data.nombre){
            productoAActualizar.nombre = data.nombre
        }
        
        if (data.tipo){
            productoAActualizar.tipo = data.tipo
        }

        if (data.precio){
            productoAActualizar.precio = data.precio
        }

        res.status(200).send('Producto actualizado')
    })
})

/* 4) Request PATCH para actualizar un dato de un usuario */
app.patch('/usuarios/:id', (req, res) => {
    let idUsuarioAEditar = parseInt(req.params.id)
    let usurioAActualizar = datos.usuarios.find((usuario) => usuario.id === idUsuarioAEditar)

    if (!usurioAActualizar){
        res.status(204).json({"messagge": "Usuario no encontrado"})
    }
    
    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data 

        if (data.nombre){
            usuarioAActualizar.nombre = data.nombre
        }
        if (data.edad){
            usuarioAActualizar.edad = data.edad
        }
        if (data.email) {
            usuarioAActualizar.email = data.email
        }
        if (data.telefono) {
            usuarioAActualizar.telefono = data.telefono
        }

        res.status(200).send('Usuario actualizado')
    })
})

app.delete('/productos/:id', (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

    if (!productoABorrar){
        res.status(204).json({"message":"Producto no encontrado"})
    }

    let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
    try {
         datos.productos.splice(indiceProductoABorrar, 1)
    res.status(200).json({"message": "success"})

    } catch (error) {
        res.status(204).json({"message": "error"})
    }
})


/* 5) Request DELETE para borrar un usuario de los datos */
app.delete('/usuarios/:id', (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id)
    let usuarioABorrar = datos.usuarios.find((usuario) => usuario.id === idUsuarioABorrar)

    if (!usuarioABorrar){
        res.status(204).json({"message": "Usuario no encontrado"})
    }

    let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)

    try {
        datos.usuarios.splice(indiceUsuarioABorrar, 1)
        res.status(200).json({"message": "success"})
        
    } catch (error) {
        res.status(204).json({"message": "error"})

    }
})

app.use((req, res) => {
    res.status(404).send('<h1>404</h1>')
})

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})




