const { processTransaction } = require("../services/switchService");

function createTransaction(req, res) {
  const result = processTransaction(req.body);

  res.status(202).json(result);
}

module.exports = {
  createTransaction
};