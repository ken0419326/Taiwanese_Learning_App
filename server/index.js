const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const kautianRoute = require("./routes").kautian;
const vocabRoute = require("./routes").vocab;
const profileRoute = require("./routes").profile;
const passport = require("passport");
require("./config/passport")(passport);

// connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ohtaibunDB_1")
  .then(() => {
    console.log("Connecting to MongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);
app.use("/api/kautian", kautianRoute);
app.use("/api/vocab", vocabRoute);
app.use("/api/profile", profileRoute);

app.listen(8080, () => {
  console.log("Server listening on port 8080...");
});
