export const nodes = [
  {
    name: "条件分支",
    type: "exclusiveGateway",
  },
  {
    name: "并行分支",
    type: "forkGateway",
  },
  {
    name: "并行聚合",
    type: "joinGateway",
  },
  {
    name: "服务调用",
    type: "service",
  },
  {
    name: "数据操作",
    type: "database",
  },
  { name: "消息发送", type: "message" },
  {
    name: "输出节点",
    type: "output",
  },
];
