const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

const upload = require("./routes/upload.route");
const spaces = require("./routes/spaces.route");
const user = require("./routes/user.route");

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", upload);
app.use("/api/space", spaces);
app.use("/api/auth", user);

async function start() {
  try {
    await mongoose.connect(URI, {});
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

start();
