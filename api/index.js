const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const multer = require("multer");

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

require("dotenv").config();
const PORT = process.env.PORT || 5000;
const DBURL = process.env.MONGO_URL;
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        secret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(401).json("User not found");
  }
});

app.get("/profile", async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res, next) => {
  res.clearCookie("token", "").json("logged out");
});

app.post("/upload-by-link", async (req, res, next) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

const photosMiddleware = multer({ dest: __dirname + "/uploads/" });
app.post(
  "/upload",
  photosMiddleware.array("photos", 100),
  async (req, res, next) => {
    const uploadfiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newName = path + "." + ext;
      fs.renameSync(path, newName);
      uploadfiles.push(newName.replace("uploads/", ""));
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
