const fs = require("fs");
const imageModel = require("../models/Image");

const uploadImage = (req, res) => {
  const saveImage = imageModel({
    name: req.body.name,
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
  res.send("image is saved");
};

const getImage = async (req, res) => {
  const allData = await imageModel.find();
  res.json(allData);
};

module.exports = { uploadImage, getImage };
