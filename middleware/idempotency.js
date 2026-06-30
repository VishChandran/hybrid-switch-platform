const crypto = require("crypto");
const {
  claimIdempotencyKey,
  completeIdempotencyRecord
} = require("../store/idempotencyStore");

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((sorted, key) => {
        sorted[key] = sortValue(value[key]);
        return sorted;
      }, {});
  }

  return value;
}

function requestHash(body) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(sortValue(body)))
    .digest("hex");
}

async function idempotency(req, res, next) {
  const key = req.header("x-idempotency-key");

  if (!key) {
    return next();
  }

  const hash = requestHash(req.body);
  const claim = await claimIdempotencyKey(key, hash);

  if (claim.outcome === "CONFLICT") {
    return res.status(409).json({
      status: "CONFLICT",
      reason: "Idempotency key already used with a different request body"
    });
  }

  if (claim.outcome === "IN_PROGRESS") {
    return res.status(409).json({
      status: "CONFLICT",
      reason: "Idempotency key is already processing"
    });
  }

  if (claim.outcome === "REPLAY") {
    res.set("x-idempotent-replay", "true");
    return res.status(claim.record.statusCode).json(claim.record.response);
  }

  const sendJson = res.json.bind(res);
  res.json = async body => {
    await completeIdempotencyRecord(key, {
      statusCode: res.statusCode,
      response: body
    });
    return sendJson(body);
  };

  return next();
}

module.exports = { idempotency, requestHash };
