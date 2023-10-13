import { createRequire } from 'node:module'
import bodyParser from 'body-parser'
import express from 'express'
import jwt from 'jsonwebtoken'
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

//Middleware para la validación de los token recibidos
function tokenAuthentication(req, res, next) {
    const headerAuthorization = req.headers['authorization']
    const tokenRecibed = headerAuthorization.split(' ')[1]

    if (tokenRecibed == null) {
        return res.status(401).json({message: "Invalid token"})
    }

    let payload = null

    try {
        //Itentamos obtener el payload del token
        payload = jwt.verify(tokenRecibed, process.env.SECRET_KEY)
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }

    if (Date.now() > payload.exp){
        return res.status(401).json({message: "Token esxpired"})
    }

    // Pasadas las validaciones
    req.user = payload.sub
    next()
}

var jsonParser = bodyParser.json()
app.use(jsonParser)

app.get('/', (req, res) => {
    res.status(200).send(html)
})

//Endpoint para validar el login
app.post('/auth', async(req, res) => {
    //Obtener los datos de login
    const userToSearch = req.body.username
    const passwordRecibed = req.body.password 

    let userFound = ''

    //Comprobación del usuario
    try {
        userFound = await Usuario.findAll({where:{username:userToSearch}})
        
        if (userFound == ''){return res.status(400).json({message:"User not found"})}
    } catch (error) {
        return res.status(400).json({message:"User not found"})
    }

    //Comprobación del password
    if (userFound[0].password !== passwordRecibed) {
        return res.status(400).json({message:"Incorrect password"})
    }

    //Generación de token
    const sub = userFound[0].dni
    const username = userFound[0].username
    const level = userFound[0].level
    
    //Firma y construcción del token 
    const token = jwt.sign({
        sub,
        username,
        level,
        exp: Date.now() + (60*1000) //1 minuto expresado en milisegundos
    }, process.env.SECRET_KEY)

    res.status(200).json({accessToken: token })
})

//Middleware
app.use((req, res, next) => {
    if ((req.method !== 'POST') && (req.method !== 'PATCH')) {return next()}

    if (req.headers['Content-Type'] !== 'application/json') {return next()}

    let bodyTemp = ''

    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })

    req.on('end', () => {
        const data = JSON.parse(bodyTemp)
        req.body = data

        next()
    })
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
            precioTotalProductos += producto.price
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

app.post('/productos', tokenAuthentication, (req, res) => {
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

/* 6) Request GET para obtener el price de un producto que se indica por id */
app.get('/productos/:id/price', async (req, res) => {
    getInfo(Producto, req.params.id, 'price', res);
})

/* 7) Request GET para obtener el nombre de un producto que se indica por ID */
app.get('/productos/:id/name', async (req, res) => {
    getInfo(Producto, req.params.id, 'name', res);

})

/* 8) Request GET para obtener el teéfono de un usuario que se indica por ID */
app.get('/usuarios/:id/telefono', async (req, res) => {
    getInfo(Usuario, req.params.id, 'telefono', res);
})

/* 9) Request GET para obtener el nombre de un usuario que se indica por ID */
app.get('/usuarios/:id/name', async (req, res) => {
    getInfo(Usuario, req.params.id, 'name', res);
})

/* 3) Request POST para agregar un nuevo usuario*/ 
app.post('/usuarios', tokenAuthentication,(req, res) => {
    add(req, Usuario, res);
})

app.patch('/productos/:id', tokenAuthentication, async (req, res) => {
    update(req, Producto, req.params.id, res);

})

/* 4) Request PATCH para actualizar un dato de un usuario */
app.patch('/usuarios/:id', tokenAuthentication,async (req, res) => {
    update(req, Usuario, req.params.id, res);
})

app.delete('/productos/:id', tokenAuthentication, async (req, res) => {
    remove(Producto, req.params.id, res);
})

/* 5) Request DELETE para borrar un usuario de los datos */
app.delete('/usuarios/:id', tokenAuthentication,async (req, res) => {
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




