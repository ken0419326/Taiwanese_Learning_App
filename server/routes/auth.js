const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("Received an authentication request.");
  next();
});

router.post("/register", async (req, res) => {
  // validate data
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // verify if is registered
  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send("這个電子批箱已經用來註冊過矣！");

  // create a new account
  let { username, email, password } = req.body;
  let newUser = new User({ username, email, password });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "User saved.",
      savedUser,
    });
  } catch (e) {
    return res.status(500).send("Unable to save user.");
  }
});

router.post("/login", async (req, res) => {
  // validate data
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // verify if is registered
  const foundUser = await User.findOne({
    email: req.body.email,
  });
  if (!foundUser) return res.status(401).send("用戶名稱抑是密碼毋著。");

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);

    if (isMatch) {
      // create json web token (JWT)
      const tokenObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "Login successfully.",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("用戶名稱抑是密碼毋著。");
    }
  });
});

module.exports = router;
