const { processOutboxEvent } = require("./outboxProcessorService");
const { saveOutboxEvent } = require("../store/outboxStore");
const topicMap = {
  AUTHORIZATION_EVENT: "authorization-events",
  FRAUD_EVENT: "fraud-events",
  SETTLEMENT_EVENT: "settlement-events",
  ANALYTICS_EVENT: "analytics-events",
  REVERSAL_EVENT: "reversal-events"
};

async function publishEvent(eventType, payload) {
  const topic = topicMap[eventType] || "unknown-events";
  const storedEvent = await saveOutboxEvent({ eventType, topic, payload });

  await processOutboxEvent(storedEvent);

  return storedEvent;
}

module.exports = {
  topicMap,
  publishEvent
};
