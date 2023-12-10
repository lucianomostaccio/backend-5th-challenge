const express = require("express");
const router = express.Router();
const messagesModel = require("../dao/models/messagesModel.js");


router.get("/", async (req, res) => {
  try {
    let messages = await messagesModel.find();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    console.log("cannot get messages with mongoose: " + error);
  }
});

module.exports = router;