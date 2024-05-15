const generalErrors = (err, req, res, next) => {
  console.log(err); // for logs
  if (err.status) {
    res.statusMessage = err.msg
    res.status(err.status).send({
      status: err.status,
      message: err.msg,
    });
  }
  else {
    res.send(500)
  }
}

module.exports = generalErrors;