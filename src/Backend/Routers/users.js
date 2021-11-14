const express = require("express");
const UserModel = require("../Models/User");
const helpFunctions = require("../helpFunc/helpFunctions")

const router = express.Router();

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
  const userName = req.body.username;
  const userPassword = helpFunctions.cryptoPassword(req.body.password);
  try {
    const checkUserName = await UserModel.find({ username: userName });
    if (checkUserName[0].password == undefined || checkUserName[0].password != userPassword) {
      next({ status: 400, msg: "Auth Failed" });
      return
    }
    res.send("secussed")
  } catch (err) {

  }
})

module.exports = router;