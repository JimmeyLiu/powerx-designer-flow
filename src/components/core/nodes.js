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

export const nodeConfig = {
  input: {
    lockAble: false,
    editAble: true,
    deleteAble: false,
    plusAble: true,
    titleCenter: true,
  },
  output: {
    lockAble: true,
    editAble: true,
    deleteAble: true,
    plusAble: false,
    titleCenter: true,
  },
  placeholder: {
    lockAble: false,
    editAble: false,
    deleteAble: true,
    plusAble: false,
  },
  exclusiveGateway: {
    lockAble: true,
    editAble: false,
    deleteAble: true,
    plusAble: true,
    titleCenter: true,
  },
  joinGateway: {
    lockAble: true,
    editAble: false,
    deleteAble: true,
    plusAble: true,
    titleCenter: true,
  },
  forkGateway: {
    lockAble: true,
    editAble: false,
    deleteAble: true,
    plusAble: true,
    titleCenter: true,
  },
  service: {
    lockAble: true,
    editAble: true,
    deleteAble: true,
    plusAble: true,
    titleCenter: false,
  },
  database: {
    lockAble: true,
    editAble: true,
    deleteAble: true,
    plusAble: true,
    titleCenter: false,
  },
  message: {
    lockAble: true,
    editAble: true,
    deleteAble: true,
    plusAble: true,
    titleCenter: false,
  },
};
