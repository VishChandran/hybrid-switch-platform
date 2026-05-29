function routeToIssuer(transaction) {
  const bin = transaction.cardNumber?.substring(0, 6);

  const issuerRoutingTable = {
    "400001": "IssuerHost",
    "400002": "PartnerIssuerA",
    "400003": "PartnerIssuerB",
    "400004": "PartnerIssuerC"
  };

  const routedIssuer = issuerRoutingTable[bin] || "UNKNOWN_ISSUER";

  return {
    bin,
    routedIssuer
  };
}

module.exports = {
  routeToIssuer
};