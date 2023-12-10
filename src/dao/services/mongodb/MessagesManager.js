const Message = require("../../models/messagesModel.js");

class MessagesManagerMongo {

  async create(data) {
    try {
      let newMessage = new Message(data);
      await newMessage.save();
      return newMessage;
    } catch (error) {
      throw new Error(`Error creating the message: ${error.message}`);
    }
  }

  async findAll() {
    try {
      let messages = await Message.find();
      return messages;
    } catch (error) {
      throw new Error(`Error obtaining all messages: ${error.message}`);
    }
  }
}

const messagesManagerDB = new MessagesManagerMongo();

module.exports = { MessagesManagerMongo, messagesManagerDB };
