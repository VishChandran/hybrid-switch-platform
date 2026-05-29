function authorizeTransaction(transaction) {

  if (transaction.amount > 1000) {
    return {
      status: "DECLINED",
      reason: "EXCEEDS_LIMIT"
    };
  }

  return {
    status: "APPROVED",
    reason: "APPROVED"
  };
}

module.exports = {
  authorizeTransaction
};