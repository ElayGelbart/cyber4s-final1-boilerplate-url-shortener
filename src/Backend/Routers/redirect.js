const express = require("express");
const UrlModel = require("../Models/URL");
const router = express.Router();

router.get("/:wishUrl", async (req, res, next) => {
  try {
    const ip = req.ip;
    console.log(ip);
    const givenUrl = req.params.wishUrl;
    const urlObj = await UrlModel.find({ newUrl: givenUrl });
    if (!urlObj.length) {
      res.redirect('/error/404');
      return
    }
    const upCount = urlObj[0].redirectCount + 1;
    // async because its only counter and user not rely on response

    const putResponse = UrlModel.updateMany({ newUrl: givenUrl }, { $set: { redirectCount: upCount } });
    res.redirect(urlObj[0].originalUrl);
    return;

  } catch (err) {
    res.redirect('/error/404');
    return
  }
});

module.exports = router;