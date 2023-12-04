// server //
const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const viewsRouter = require("./routers/views.router.js");
const apiRouter = require("./routers/api.router.js");
const onConnection = require("./controllers/socket.controller.js")

// initialize server
const app = express();
const port = 8080;
const server = app.listen(port, () => {
  console.log(`Server listening in port: ${port}`);
}); 

// sockets server
const websocketServer = new Server(server); 
websocketServer.on('connection', onConnection(websocketServer));

// handlebars engine & templates:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static"))); //specify static folder

// routers
app.use("/", viewsRouter);
app.use("/api/", apiRouter)


