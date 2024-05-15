const dns = require("dns");

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

module.exports.dnsLookup4URL = dnsLookup4URL;