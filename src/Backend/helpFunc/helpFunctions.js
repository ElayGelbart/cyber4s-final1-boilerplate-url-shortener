const dnsLookup4URL = async (givenURL) => {
  await new Promise((res, rej) => {
    dns.lookup(givenURL, (err, address, family) => {
      if (err) {
        return rej(err);
      }
      res(address);
    })
  });
}

module.exports.dnsLookup4URL = dnsLookup4URL;