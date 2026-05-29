const { resolveScenario } = require("./scenarioResolverService");
const { routeToIssuer } = require("./issuerGatewayService");
const { validatePin } = require("./pinValidationService");
const { authorizeTransaction } = require("./authorizationService");

function processTransaction(transaction) {
  const transactionId = `TXN-${Date.now()}`;
  const scenario = resolveScenario(transaction);
  const issuerRouting = routeToIssuer(transaction)
  const pinValid = validatePin(transaction.pin);
  if (!pinValid) {
   return {
    transactionId,
    status: "DECLINED",
    declineReason: "INVALID_PIN"
  };
  }
  const authorizationResult = authorizeTransaction(transaction);
  
  return {
  transactionId,
  status: authorizationResult.status,
  reason: authorizationResult.reason,
  network: transaction.network,
  channel: transaction.channel,
  scenario,
  issuerRouting,
  pinValid,
};
}

module.exports = {
  processTransaction
};