let dataC = {
  name: "流程C",
  nodeList: [
    {
      id: "nodeA",
      name: "流程C-节点A",
      type: "task",
      left: "400px",
      top: "30px",
      ico: "el-icon-user-solid",
    },
    {
      id: "nodeB",
      name: "流程C-节点B",
      type: "task",
      left: "400px",
      top: "130px",
      ico: "el-icon-goods",
    },
    {
      id: "nodeC",
      name: "流程C-节点C",
      type: "task",
      left: "400px",
      top: "230px",
      ico: "el-icon-present",
    },
    {
      id: "nodeD",
      name: "流程D-节点D",
      type: "task",
      left: "400px",
      top: "330px",
      ico: "el-icon-present",
    },
  ],
  lineList: [
    {
      from: "nodeA",
      to: "nodeB",
    },
    {
      from: "nodeB",
      to: "nodeC",
    },
    {
      from: "nodeA",
      to: "nodeD",
    },
    {
      from: "nodeD",
      to: "nodeC",
    },
  ],
};

export function getData() {
  return dataC;
}
