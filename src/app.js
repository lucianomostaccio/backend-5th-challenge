//server//

const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const productRouter = require("./routers/product.router.js");
const ProductManager = require("./services/ProductManager.js");
const productManager = new ProductManager();
const cartRouter = require("./routers/cart.router.js");
const viewsRouter = require("./routers/views.router.js");

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Server listening in port: ${port}`);
}); // Initialize server

const io = new Server(httpServer); // sockets server

//plantillas:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
//app.set('views',__dirname+'/views'); also works, but its safer to use path.join
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "static"))); //specify static folder
// app.use(express.static(__dirname+'/static')); also works, but its safer to use path.join
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  // Listen to client's events
  socket.on("newProduct", async (productData) => {
    try {
      await productManager.addProduct(productData);
      const allProducts = productManager.getProducts();
      io.emit("updateProductList", allProducts);
    } catch (error) {
      console.error("Error adding the product in real time:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const allProducts = productManager.getProducts();
      io.emit("updateProductList", allProducts);
    } catch (error) {
      console.error("Error deleting the product in real time:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} has disconnected from the server`);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routers
const productRoutes = productRouter;
const cartRoutes = cartRouter;

// Set up the routers
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
