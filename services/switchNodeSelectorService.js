const switchNodes = ["Switch-A", "Switch-B"];

function selectSwitchNode(transactionId) {
  const timestampPart = Number(transactionId.split("-")[1]);
  const nodeIndex = timestampPart % switchNodes.length;

  return switchNodes[nodeIndex];
}

module.exports = {
  selectSwitchNode
};