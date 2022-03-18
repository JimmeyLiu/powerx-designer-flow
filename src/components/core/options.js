//https://wdd.js.org/jsplumb-chinese-tutorial/#/?id=_212-%e8%8a%82%e7%82%b9%e7%bd%91%e6%a0%bc%e5%af%b9%e9%bd%90
//https://docs.jsplumbtoolkit.com/community-2.x/current/articles/anchors.html
export const jsplumbOptions = {
  methods: {
    getSourceOptions(type) {
      return "forkGateway" === type
        ? this.forkSourceOptions
        : this.sourceOptions;
    },
    getTargetOptions(type) {
      return "joinGateway" === type || "output" === type
        ? this.multiTargetOptions
        : this.targetOptions;
    },
  },
  data() {
    return {
      /**
       * 连线参数
       */
      connectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault、Perimeter
        //faces 值 top left right bottom
        anchor: ["Continuous", "Top", "Bottom"],
        // 设置连线上面的label样式
        labelStyle: {
          cssClass: "flow-edge-label",
        },
      },
      /**
       * 源点配置参数
       */
      sourceOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        anchor: ["Continuous", "Top", "Bottom"],
        // 是否允许自己连接自己
        allowLoopback: false,
        maxConnections: 1,
        onMaxConnections: function (info) {
          console.log(`超过了最大值连线: ${info.maxConnections}`);
        },
      },
      //网关节点配置
      forkSourceOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        anchor: ["Continuous", "Top", "Bottom"],
        // 是否允许自己连接自己
        allowLoopback: false,
        maxConnections: 10,
        onMaxConnections: function (info) {
          console.log(`超过了最大值连线: ${info.maxConnections}`);
        },
      },
      targetOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        // filter: ".flow-node-drag",
        // filterExclude: false,
        // 是否允许自己连接自己
        anchor: ["Continuous", "Top", "Bottom"],
        allowLoopback: false,
        maxConnections: 1,
        dropOptions: { hoverClass: "ef-drop-hover" },
        onMaxConnections: function (info) {
          console.log(`超过了最大值连线: ${info.maxConnections}`);
        },
      },
      multiTargetOptions: {
        // 设置可以拖拽的类名，只要鼠标移动到该类名上的DOM，就可以拖拽连线
        // filter: ".flow-node-drag",
        // filterExclude: false,
        // 是否允许自己连接自己
        anchor: ["Continuous", "Top", "Bottom"],
        allowLoopback: false,
        maxConnections: 30,
        dropOptions: { hoverClass: "ef-drop-hover" },
        onMaxConnections: function (info) {
          console.log(`超过了最大值连线: ${info.maxConnections}`);
        },
      },
    };
  },
};
