const mongoose = require("mongoose");
const Message = require("./Message");
const ConversationSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true,
  },

  /*  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ], */
  message: { type: Array },
  /* timestamps: {
    createdAt: true,
    updatedAt: false,
  }, */
});

function getUserConversationModel(userId) {
  // Generate a unique model name based on the user ID
  const modelName = userId;

  // Check if the model already exists
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  // Create a new model dynamically
  const UserConversationModel = mongoose.model(
    modelName,
    ConversationSchema,
    userId // Specify the collection name
  );

  return UserConversationModel;
}

module.exports = getUserConversationModel;
//module.exports = mongoose.model("Conversation", ConversationSchema);
