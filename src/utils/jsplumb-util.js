import lodash from "lodash";

export const initNode = (flowData, jsplumb) => {
    
  for (let i = 0; i < flowData.nodes.length; i++) {
    let node = flowData.nodes.nodeList[i];
    // 设置源点，可以拖出线连接其他节点
    this.jsPlumb.makeSource(
      node.id,
      lodash.merge(this.jsplumbSourceOptions, {})
    );
    // // 设置目标点，其他源点拖出的线可以连接该节点
    this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);
    this.jsPlumb.draggable(node.id, {
      containment: "parent",
      stop: function (el) {
        // 拖拽节点结束后的对调
        console.log("拖拽结束: ", el);
      },
    });
  }
};
