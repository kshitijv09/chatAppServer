const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  /* user_avatar: {
    type: String,
    required: false,
  }, */
  receiver: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdtime: {
    type: String,
    default: `${new Date().getHours()}:${new Date().getMinutes()}`,
  },
  /* timestamps: {
    createdAt: true,
    updatedAt: false,
  }, */
});

module.exports = mongoose.model("Message", MessageSchema);
