const crypto = require("crypto");
const { getIssuerResponse } = require("./issuerResponseService");
const { resolveScenario } = require("./scenarioResolverService");
const { selectSwitchNode } = require("./switchNodeSelectorService");
const { routeToIssuer } = require("./issuerGatewayService");
const { validatePin } = require("./pinValidationService");
const { authorizeTransaction } = require("./authorizationService");
const { buildReversalEvent } = require("./reversalEventService");
const { processStandIn } = require("./standInProcessingService");
const { publishEvent } = require("./eventPublisherService");
const { saveTransaction } = require("../store/transactionStore");
const { buildFraudEvent } = require("./fraudEventService");
const { buildSettlementEvent } = require("./settlementEventService");
const { buildAnalyticsEvent } = require("./analyticsEventService");

function publishAuthorizationAndAnalytics(response, transaction) {
  publishEvent("AUTHORIZATION_EVENT", response);
  publishEvent("ANALYTICS_EVENT", buildAnalyticsEvent(response, transaction));
}

function processTransaction(transaction) {
  const transactionId = `TXN-${crypto.randomUUID()}`;
  const switchNode = selectSwitchNode();
  const scenario = resolveScenario(transaction);
  const issuerRouting = routeToIssuer(transaction);

  if (switchNode === "NO_ACTIVE_NODE") {
    const response = {
      transactionId,
      switchNode,
      status: "SYSTEM_UNAVAILABLE",
      reason: "NO_ACTIVE_SWITCH_NODE",
      network: transaction.network,
      channel: transaction.channel,
      scenario,
      issuerRouting
    };

    saveTransaction(response);
    publishAuthorizationAndAnalytics(response, transaction);
    return response;
  }

  const pinValid = validatePin(transaction.pin);

  if (!pinValid) {
    const response = {
      transactionId,
      switchNode,
      status: "DECLINED",
      reason: "INVALID_PIN",
      network: transaction.network,
      channel: transaction.channel,
      scenario,
      issuerRouting,
      pinValid
    };

    saveTransaction(response);
    publishAuthorizationAndAnalytics(response, transaction);
    return response;
  }

  const issuerResponse = getIssuerResponse(transaction);

  if (issuerResponse.status === "TIMEOUT") {
    const standInResult = processStandIn(transaction);
    const response = {
      transactionId,
      switchNode,
      status: standInResult.status,
      reason: standInResult.reason,
      network: transaction.network,
      channel: transaction.channel,
      scenario,
      issuerRouting,
      pinValid
    };

    saveTransaction(response);
    publishEvent("AUTHORIZATION_EVENT", response);

    if (response.status === "APPROVED") {
      publishEvent("FRAUD_EVENT", buildFraudEvent(response, transaction));

      const settlementEvent = buildSettlementEvent(response, transaction);
      if (settlementEvent) {
        publishEvent("SETTLEMENT_EVENT", settlementEvent);
      }
    }

    publishEvent("ANALYTICS_EVENT", buildAnalyticsEvent(response, transaction));
    return response;
  }

  const authorizationResult = authorizeTransaction(transaction);

  const response = {
    transactionId,
    switchNode,
    status: authorizationResult.status,
    reason: authorizationResult.reason,
    network: transaction.network,
    channel: transaction.channel,
    scenario,
    issuerRouting,
    pinValid
  };

  const fraudEvent = buildFraudEvent(response, transaction);
  const reversalEvent = buildReversalEvent(response, transaction);
  const settlementEvent = reversalEvent
    ? null
    : buildSettlementEvent(response, transaction);
  const analyticsEvent = buildAnalyticsEvent(response, transaction);

  saveTransaction(response);
  publishEvent("AUTHORIZATION_EVENT", response);
  publishEvent("FRAUD_EVENT", fraudEvent);

  if (settlementEvent) {
    publishEvent("SETTLEMENT_EVENT", settlementEvent);
  }

  if (reversalEvent) {
    publishEvent("REVERSAL_EVENT", reversalEvent);
  }

  publishEvent("ANALYTICS_EVENT", analyticsEvent);
  return response;
}

module.exports = {
  processTransaction
};
