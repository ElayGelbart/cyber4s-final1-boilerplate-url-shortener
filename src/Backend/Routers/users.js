const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const helpFunctions = require("../helpFunc/helpFunctions")
const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY || process.argv[3]; // remember this change

router.post("/signup", async (req, res, next) => {
  console.log("here signup");
  const userName = req.body.username;
  const userPassword = req.body.password;
  console.log(userName, userPassword, "user!");
  try {
    const checkUserName = await UserModel.find({ username: userName });
    console.log(checkUserName);
    const userHashedPassword = helpFunctions.cryptoPassword(userPassword);
    const addUserDataMongo = await UserModel.insertMany({ username: userName, password: userHashedPassword });
    res.send("secussed");
  } catch (err) {
    next({ status: 400, msg: "User is there" })
  }
}
);

router.post("/login", async (req, res, next) => {
  console.log("in login");
  const userName = req.body.username;
  const userPassword = helpFunctions.cryptoPassword(req.body.password);
  try {
    const checkUserName = await UserModel.find({ username: userName });
    if (checkUserName[0].password == undefined || checkUserName[0].password != userPassword) {
      next({ status: 400, msg: "Auth Failed" });
      return
    }
    const token = jwt.sign({ username: userName }, jwtSecretKey, { expiresIn: "1h" });
    res.cookie("token", token, { maxAge: 9000000 });
    console.log("cookie saved");
    res.redirect("../..")
    return
  } catch (err) {
    next(err)
  }
});

module.exports = router;