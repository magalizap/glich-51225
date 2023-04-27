import express from 'express'
import productRouter from './routes/product.routes.js'
import multer from 'multer'
import { __dirname, __filename } from './path.js'
import { engine } from 'express-handlebars'
import * as path from 'path'
import { Server } from 'socket.io'

//Configuraciones
const app = express()
const PORT = 4000
const storage = multer.diskStorage({
    destination: (req, file, cb) => { // destino de mis img cargadas
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => { // cb es callback
        cb(null, `${file.originalname}`)
    }
})
app.engine('handlebars', engine()) // voy a trabajar con hbs
app.set('view engine', 'handlebars') // mis vistas son de hbs
app.set('views', path.resolve(__dirname, './views')) // src/views (usamos una concatenación para encontrar mi ruta actual)
const server = app.listen(PORT, () => { // la necesito para ubicar mi servidor, por eso va antes. Sino, iría al final
    console.log(`Server on port ${PORT}`)
})


//Middlewares
app.use(express.json()) //Permite ejecutar JSON en mi app
app.use(express.urlencoded({ extended: true })) //Permite poder realizar consultas en la URL (req.query)
const upload = (multer({storage: storage})) // instancio un objeto con la config de multer presentada

//ServerIO
const io = new Server(server) //llamo a mi servidor
const mensaje = []

io.on('connection', (socket) => {
    console.log('Cliente conectado')
    socket.on('mensaje', info => {
        console.log(info)
        mensaje.push(info)
        io.emit('mensajes', mensaje) // le envio todos los mensajes guardados
    })
})


//Routes
app.use('/product', productRouter)
        //antes decía '/static'
app.use('/', express.static(__dirname + '/public')) // defino la ruta de mi carpeta pública
app.post('/upload', upload.single('product'), (req, res) => {
    //imagenes
    console.log(req.body)
    console.log(req.file)
    res.send('Imagen subida')
})


// HBS
app.get('/', (req, res) => {
    res.render('index')
})

