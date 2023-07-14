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
    cb(null, `${Date.now()}-${req.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.route("/file").post(upload.single("avatarImage"), file.uploadImage);
module.exports = router;
