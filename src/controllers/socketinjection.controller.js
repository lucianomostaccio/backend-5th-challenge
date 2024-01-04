const messagesManager = require("../dao/services/fs/MessagesManager");

export function inyectarSocketServer(socketServer) {
  return function (req, res, next) {
    res["notifyNewMessage"] = async () => {
      socketServer.emit("messages", await messagesManager.findAll());
    };
    next();
  };
}

