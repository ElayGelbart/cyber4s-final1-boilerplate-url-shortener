const express = require("express");
const validator = require('validator');
const axios = require('axios');
const helpFunctions = require("../helpFunc/helpFunctions")
const router = express.Router();

router.post("/shorturl/:nameOfNewUrl", async (req, res, next) => {
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
    helpFunctions.dnsLookup4URL(oldURLhostname);
  } catch (err) {
    next({ status: 400, msg: "Provide URL does not Working" });
    return;
  }
  const UrlObj = {
    creationDate: new Date().toISOString().substring(0, 10),
    redirectCount: 1,
    originalUrl: oldURL,
  };
  try {
    const getResponse = await axios.get(`https://api.jsonbin.io/v3/b/6183b2f09548541c29cd8045`, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": process.env.API_SECRET_KEY,
      }
    });
    const EGShortURLOBJ = getResponse.data.record;
    if (EGShortURLOBJ.newUrl == undefined) {
      next({ status: 401, msg: "New URL Taken" })
      return;
    }
    EGShortURLOBJ[newUrl] = UrlObj;
    const putResponse = await axios.put(`https://api.jsonbin.io/v3/b/6183b2f09548541c29cd8045`, JSON.stringify(EGShortURLOBJ), {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": process.env.API_SECRET_KEY,
      }
    });
    res.send(`${newUrl}`); // To Show In Frontend
  } catch (err) {
    next(err)
  }
});

router.get("/statistic/:shorturl", async (req, res, next) => {
  try {
    const givenUrl = req.params.shorturl;
    const getResponse = await axios.get(`https://api.jsonbin.io/v3/b/6183b2f09548541c29cd8045`, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": process.env.API_SECRET_KEY,
      }
    });
    const EGShortURLOBJ = getResponse.data.record;
    for (let value in EGShortURLOBJ) {
      if (value == givenUrl) {
        const urlObj = EGShortURLOBJ[value];
        res.send(urlObj);
        return;
      }
    }
    next({ status: 404, msg: "URL NOT FOUND" });
  } catch (err) {
    console.log("in error");
    next(err);
  }
});

module.exports = router;