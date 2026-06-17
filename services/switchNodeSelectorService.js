const switchNodes = ["Switch-A", "Switch-B"];
const { getNodeStatus } = require("./nodeHealthService");

let nextNodeIndex = 0;

function selectSwitchNode() {
  const nodeIndex = nextNodeIndex;
  nextNodeIndex = (nextNodeIndex + 1) % switchNodes.length;

  const selectedNode = switchNodes[nodeIndex];

if (getNodeStatus(selectedNode) === "UP") {
  return selectedNode;
}

const alternateNode = switchNodes.find(
  node => getNodeStatus(node) === "UP"
);

return alternateNode || "NO_ACTIVE_NODE";
}

module.exports = {
  selectSwitchNode
};
