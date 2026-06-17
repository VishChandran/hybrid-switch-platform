const { processTransaction } = require("../services/switchService");
const { getTransaction } = require("../store/transactionStore");

function createTransaction(req, res) {
  const result = processTransaction(req.body);
  const statusCode = result.status === "SYSTEM_UNAVAILABLE" ? 503 : 202;

  res.status(statusCode).json(result);
}

function getTransactionById(req, res) {
  const transaction = getTransaction(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      status: "NOT_FOUND",
      reason: "TRANSACTION_NOT_FOUND"
    });
  }

  res.status(200).json(transaction);
}

module.exports = {
  createTransaction,
  getTransactionById
};
