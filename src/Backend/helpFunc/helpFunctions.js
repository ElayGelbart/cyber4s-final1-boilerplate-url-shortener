const dns = require("dns");
const crypto = require("crypto");

const dnsLookup4URL = async (givenURL) => {
  await new Promise((res, rej) => {
    dns.lookup(givenURL, (err, address, family) => {
      if (err) {
        rej(err);
        return;
      }
      res(address);
    })
  });
}

const cryptoPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
}

module.exports.dnsLookup4URL = dnsLookup4URL;
module.exports.cryptoPassword = cryptoPassword;