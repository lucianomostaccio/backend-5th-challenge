//servidor//

const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const productRouter = require("../src/routes/productRouter.js");
const ProductManager = require("../src/managers/ProductManager.js");
const productManager = new ProductManager();
const cartRouter = require("../src/routes/cartRouter.js");
const viewsRouter = require("./routes/views.router.js");

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
}); // Iniciar el servidor

const io = new Server(httpServer); // servidor para trabajar con sockets

//plantillas:
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
//app.set('views',__dirname+'/views'); funciona así también, pero es más seguro usar path.join
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname+'/public')); funciona así también, pero es más seguro usar path.join
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);
  // Escucha eventos desde el cliente
  socket.on("newProduct", async (productData) => {
    try {
      await productManager.addProduct(productData);
      const allProducts = productManager.getProducts();
      io.emit("updateProductList", allProducts);
    } catch (error) {
      console.error("Error al agregar producto en tiempo real:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const allProducts = productManager.getProducts();
      io.emit("updateProductList", allProducts);
    } catch (error) {
      console.error("Error al eliminar producto en tiempo real:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Cliente ${socket.id} se ha desconectado`);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar routers
const productRoutes = productRouter;
const cartRoutes = cartRouter;

// Configurar los routers
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
