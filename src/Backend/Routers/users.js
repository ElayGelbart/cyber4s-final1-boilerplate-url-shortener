const express = require("express");
const UserModel = require("../Models/User");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const userName = req.body.username;
  const userPassword = req.body.password;
  try {
    const checkUserName = await UserModel.find({ username: userName });
    console.log(checkUserName);
    const addUserDataMongo = await UserModel.insertMany({ username: userName, password: userPassword });
    res.send("secussed");
  } catch (err) {
    next({ status: 400, msg: "User is there" })
  }
});

router.post("/login", async (req, res, next) => {
  const userName = req.body.username;
  const userPassword = req.body.password;
  try {
    const checkUserName = await UserModel.find({ username: userName });
    if (checkUserName.password == undefined || checkUserName.password != userPassword) {
      next({ status: 400, msg: "Auth Failed" });
      return
    }
    res.send("secussed")
  } catch (err) {

  }
})

module.exports = router;