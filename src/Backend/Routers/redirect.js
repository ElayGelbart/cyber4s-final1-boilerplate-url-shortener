const express = require("express");
const axios = require('axios');

const router = express.Router();

router.use("/", (req, res, next) => {
  if (req.url == "/") { // Mobile Check
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];
    for (let device of toMatch) {
      if (device.test(req.headers['user-agent'])) {
        res.redirect("/Mobile");
        return;
      }
    };
    next();
  } else {
    next();
  }
});

router.get("/:wishUrl", async (req, res, next) => {
  try {
    const givenUrl = req.params.wishUrl;
    const getResponse = await axios.get(`https://api.jsonbin.io/v3/b/6183b2f09548541c29cd8045`, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": process.env.API_SECRET_KEY,
      }
    });
    const EGShortURLOBJ = getResponse.data.record;
    for (let value in EGShortURLOBJ) {
      if (value == givenUrl) {
        const redirectUrl = EGShortURLOBJ[value].originalUrl;
        EGShortURLOBJ[value].redirectCount++;
        // async because its only counter and user not rely on response
        const putResponse = axios.put(`https://api.jsonbin.io/v3/b/6183b2f09548541c29cd8045`, JSON.stringify(EGShortURLOBJ), {
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": process.env.API_SECRET_KEY,
          }
        });
        res.redirect(redirectUrl);
        return;
      }
    }
    res.redirect('/error/404');
    return
  } catch (err) {
    res.redirect('/error/404');
    return
  }
});

module.exports = router;