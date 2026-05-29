const { resolveScenario } = require("./scenarioResolverService");
const { routeToIssuer } = require("./issuerGatewayService");

function processTransaction(transaction) {
  const transactionId = `TXN-${Date.now()}`;
  const scenario = resolveScenario(transaction);
  const issuerRouting = routeToIssuer(transaction);

  return {
    transactionId,
    status: "ACCEPTED",
    network: transaction.network,
    channel: transaction.channel,
    scenario,
    issuerRouting,
    message: "Transaction accepted by Modern Switch"
  };
}

module.exports = {
  processTransaction
};