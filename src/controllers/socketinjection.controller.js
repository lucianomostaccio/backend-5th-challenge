const messagesManager = require("../dao/services/mongodb/MessagesManager");

export function inyectarSocketServer(socketServer) {
  return function (req, res, next) {
    res["notificarNuevoMensaje"] = async () => {
      socketServer.emit("messages", await messagesManager.findAll());
    };
    next();
  };
}

