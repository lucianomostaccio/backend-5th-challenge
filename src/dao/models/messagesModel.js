const mongoose = require("mongoose");

const messagesCollection = 'messages'

const messagesSchema = new mongoose.Schema({
    user: String,
    message: String
})


// {user:correoDelUsuario, 
// message: mensaje del usuario}
 
module.exports = mongoose.model(messagesCollection, messagesSchema);
