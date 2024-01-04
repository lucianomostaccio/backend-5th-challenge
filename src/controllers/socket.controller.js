// @ts-nocheck
const ProductManager = require("../dao/services/mongodb/ProductManager");
const messagesManager = require("../dao/services/mongodb/MessagesManager");
const productManager = new ProductManager();

function onConnection(webSocketServer) {
  return async function (socket) {
    console.log(socket.handshake.auth.usuario + ' se conectó')
    socket.broadcast.emit(
      'newUser',
      socket.handshake.auth.usuario)

    socket.emit(
      'messages',
      await messagesManager.findAll())

    // Listen to client's events
    socket.on("newProduct", async (productData) => {
      try {
        await productManager.addProduct(productData);
        const allProducts = productManager.getProducts();
        webSocketServer.emit("updateProductList", allProducts);
      } catch (error) {
        console.error("Error adding the product in real time:", error);
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        await productManager.deleteProduct(productId);
        const allProducts = productManager.getProducts();
        webSocketServer.emit("updateProductList", allProducts);
      } catch (error) {
        console.error("Error deleting the product in real time:", error);
      }
    });

    socket.on("newMessage", async (messageData) => {
      try {
        const newMessage = await messagesManager.create(messageData);
        webSocketServer.emit("newMessage", newMessage);
        socketServer.emit(
          'messages',
          await messagesManager.findAll())
      } catch (error) {
        console.error("Error adding the messages in real time:", error);
      }
    });

    socket.on('disconnecting', () => {
      socket.broadcast.emit(
        'userDisconnected',
        socket.handshake.auth.usuario)
    })
  };
}



module.exports = onConnection;


