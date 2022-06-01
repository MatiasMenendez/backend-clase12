const express = require('express');
const { Router } = express;
const Api = require("./api.js");
const Chat = require("./Chat.js");
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const app = express()
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const router = Router();

const PORT = 8000;

const server = httpServer.listen(PORT, () => {
    console.log(`Server http listening in port ${server.address().port}`)
 })
server.on("error", error => console.log(`Error in server ${error}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.set("view engine", "ejs"); 
app.set("views", "./views") 

let products = [
    {
        title: "Yerba mate",
        price: 100,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_2X_813618-MLA46121646793_052021-F.webp",
        id: 1
    }, 
    {
        title: "Mate de calabaza",
        price: 300,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_702437-MLA48733352973_012022-O.webp",
        id: 2
    },
    {
        title: "Bombilla",
        price: 50,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_898479-MLA45731292464_042021-O.webp",
        id: 3
    },
    {
        title: "Mate de plastico",
        price: 200,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_796640-MLA43965840273_112020-O.webp",
        id: 4
    },
];

const productsApi = new Api(products);
const myChat = new Chat("mensajes.json");

io.on("connection", async socket => { 
    
    console.log("A new user is logged in");
    socket.emit("Productos", products);
    socket.emit("Mensajes", await myChat.getAll());

    socket.on("new-message", async data => {
        data.time = new Date().toLocaleString()//moment().locale("es").format('MMMM Do YYYY, h:mm:ss a'); 
        await myChat.save(data);
        io.sockets.emit("MensajeIndividual", data)
    })

    socket.on("nuevo-producto", data => {
        io.sockets.emit("ProductoIndividual", data)
    })
})

app.get('', (req, res) => {
    const data ={products}
    return res.render('pages/index', data)
})

 router.post('/productos', (req, res) => {
     return productsApi.postProduct(req, res)
  })

router.get("/", (req, res) => {
    res.render("pages/index", { products: products});
});

app.use('/', router);

