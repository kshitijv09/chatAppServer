const ConversationModel = require("../models/Conversation");
//const Conversation=require("../models/")
const getConversation = async (req, res) => {
  const contactName = req.params.contactName;
  const userName = req.params.userName;
  //console.log("userName is,", userName);
  const Conversation = ConversationModel(userName);

  try {
    // console.log("Contact Name is", contactName);
    const conversation = await Conversation.find({ contactName });
    //console.log("Convo is", conversation);
    res.json(conversation);
  } catch {
    console.log("Error retrieving conversations:", err);
    res.sendStatus(500);
  }
};

const addConversation = async (req, res) => {
  const contactName = req.params.contactName;
  const userName = req.params.userName;
  console.log("Req.sender is", req.sender);
  const message = {
    sender: req.body.sender,
    receiver: req.body.receiver,
    message: req.body.message,
    createdTime: req.body.createdTime,
  };
  console.log("Message is", message);
  const Conversation = ConversationModel(userName);
  try {
    const conversation = await Conversation.findOne({ contactName });
    if (conversation) {
      // If the conversation exists, add the new message to the conversation
      conversation.message.push(message);

      // Save the updated conversation
      conversation
        .save()
        .then(() => {
          console.log("Message added to existing conversation.");
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log("Error saving conversation:", err);
          res.sendStatus(500);
        });
    } else {
      // If the conversation does not exist, create a new conversation document
      const newConversation = new Conversation({
        contactName,
        message: [message],
      });

      newConversation
        .save()
        .then(() => {
          console.log("New conversation created.");
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log("Error saving conversation:", err);
          res.sendStatus(500);
        });
    }
  } catch {
    console.log("Error retrieving conversations:", err);
    res.sendStatus(500);
  }
};

const getContacts = async (req, res) => {
  //const contactName = req.params.contactName;
  const userName = req.params.userName;
  //console.log("userName is,", userName);s
  const Conversation = ConversationModel(userName);
  const conversations = await Conversation.find();
  const contacts = [];

  conversations.forEach((element) => {
    contacts.push(element.contactName);
  });
  //console.log("Set is", contacts);
  res.json({ contacts });
};

module.exports = { getConversation, addConversation, getContacts };
