const typeSize = {
  placeholder: [30, 80],
  input: [40, 80],
  onput: [40, 80],
  forkGateway: [40, 120],
  joinGateway: [40, 120],
};

export const calcPosition = (clientX, clientY, containerRef, nodeType) => {
  let left = clientX,
    top = clientY;
  let containerRect = containerRef.getBoundingClientRect();
  // 计算是否拖入到容器中
  if (
    left < containerRect.x ||
    left > containerRect.width + containerRect.x ||
    top < containerRect.y ||
    containerRect.y > containerRect.y + containerRect.height
  ) {
    // this.$message.error("请把节点拖入到画布中");
    return;
  }
  left = left - containerRect.x + containerRef.scrollLeft;
  top = top - containerRect.y + containerRef.scrollTop;

  let nodeSize = typeSize[nodeType] || [80, 220];
  // 居中
  left -= nodeSize[1] / 2;
  top -= nodeSize[0] / 2;
  return [left, top];
};
