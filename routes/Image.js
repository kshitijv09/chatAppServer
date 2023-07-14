const multer = require("multer");
const express = require("express");
const file = require("../controllers/fileUpload");
const router = express.Router();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router
  .route("/file")
  .post(upload.single("avatarImage"), file.uploadImage)
  .get(file.getImage);

module.exports = router;
