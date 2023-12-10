const mongoose = require("mongoose");

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  user: String,
  message: String,
});

// {user:correoDelUsuario,
// message: mensaje del usuario}

const message = mongoose.model(messagesCollection, messagesSchema);

module.exports = message;
