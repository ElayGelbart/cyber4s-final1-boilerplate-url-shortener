const express = require("express");
const UrlModel = require("../Models/URL");
const router = express.Router();
const axios = require("axios");

router.get("/:wishUrl", async (req, res, next) => {
  try {
    const givenUrl = req.params.wishUrl;
    const urlObj = await UrlModel.find({ newUrl: givenUrl });
    if (!urlObj.length) {
      res.redirect('/error/404');
      return
    }

    // async because its only counter and user not rely on response
    const userIP = req.ip;
    res.redirect(urlObj[0].originalUrl);
    await axios.get(`http://ip-api.com/json/${userIP}`).then(res => {
      console.log(res);
      await UrlModel.findOneAndUpdate({ newUrl: givenUrl }, { $push: { ipEntrys: res.data } })
    });
    return;

  } catch (err) {
    res.redirect('/error/404');
    return
  }
});

module.exports = router;