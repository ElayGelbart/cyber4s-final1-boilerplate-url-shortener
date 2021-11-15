const express = require("express");
const validator = require('validator');

const helpFunctions = require("../helpFunc/helpFunctions")
const jwt = require("jsonwebtoken");
const UrlModel = require("../Models/URL");

const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY || process.argv[3]; // remember this change

router.post("/shorturl/:nameOfNewUrl", async (req, res, next) => {
  const token = req.cookies.token;
  const username = jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      next({ status: 401, msg: "Go Away" });
      return;
    }
    return user.username
  });
  const oldURL = req.body.oldurl;
  const newUrl = req.params.nameOfNewUrl;
  if (!validator.isURL(oldURL)) { // Double Check Arguments
    next({ status: 401, msg: "Go Away" });
    return
  }
  if (/egshorturl.heroku/.test(oldURL)) {
    next({ status: 401, msg: "Cant Use This URL" });
    return;
  }
  if (!validator.isLength(newUrl, { min: 3, max: 15 }) || !validator.isAlphanumeric(newUrl)) {
    next({ status: 401, msg: "Go Away" });
    return
  }

  //DNS check
  const oldURLhostname = new URL(oldURL).hostname;
  try {
    await helpFunctions.dnsLookup4URL(oldURLhostname).catch(err => {
      throw new Error(err);
    });
  } catch (err) {
    next({ status: 400, msg: "Provide URL does not Working" });
    return;
  }
  const UrlObj = {
    username: username,
    creationDate: new Date().toISOString().substring(0, 10),
    redirectCount: 1,
    originalUrl: oldURL,
    newUrl: newUrl
  };
  try {
    const nameOfURLFound = await UrlModel.find({ newUrl: newUrl });
    if (nameOfURLFound.length) {
      next({ status: 401, msg: "New URL Taken" })
      return;
    }
    const respond = await UrlModel.insertMany(UrlObj)
    res.send(`${newUrl}`); // To Show In Frontend
  } catch (err) {
    next(err)
  }
});

router.get("/statistic/", async (req, res, next) => {
  try {
    const username = jwt.verify(token, jwtSecretKey, (err, user) => {
      if (err) {
        next({ status: 401, msg: "Go Away" });
        return;
      }
      return user.username
    });
    const UrlOfUsername = await UrlModel.find({ username: username })
    if (UrlOfUsername.length) {
      res.send(UrlOfUsername)
      return;
    }
    next({ status: 404, msg: "User Dont have URL" });
  } catch (err) {
    console.log("in error");
    next(err);
  }
});

module.exports = router;