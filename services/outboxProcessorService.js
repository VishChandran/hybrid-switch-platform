const { consumeEvent } = require("../consumers/eventConsumerService");
const {
  markOutboxFailed,
  markOutboxProcessed
} = require("../store/outboxStore");
const { saveDeadLetter } = require("../store/deadLetterStore");

async function processOutboxEvent(storedEvent) {
  try {
    console.log(
      `[TOPIC] ${storedEvent.topic} [EVENT] ${storedEvent.eventType}`,
      JSON.stringify(storedEvent.payload)
    );

    consumeEvent(
      storedEvent.topic,
      storedEvent.eventType,
      storedEvent.payload
    );

    await markOutboxProcessed(storedEvent.eventId);
  } catch (error) {
    await markOutboxFailed(storedEvent.eventId, error);
    await saveDeadLetter({
      sourceType: "OUTBOX_EVENT",
      sourceId: storedEvent.eventId,
      reason: error.message,
      payload: storedEvent.payload,
      retryCount: storedEvent.retryCount + 1
    });
  }
}

module.exports = {
  processOutboxEvent
};
