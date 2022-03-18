<template>
	<div
		id="flow-container"
		ref="flowContainer"
		class="container"
		@dragover="allowDrop"
	>
		<div class="container-toolbar">
			<span class="container-toolbar-item" @click="lockAll"
				><LockOutlined
			/></span>
			<span class="container-toolbar-item" @click="unlockAll"
				><UnlockOutlined
			/></span>
			<span class="container-toolbar-item" @click="zoomAdd"
				><ZoomInOutlined
			/></span>
			<span class="container-toolbar-item" @click="zoomSub"
				><ZoomOutOutlined
			/></span>
		</div>
		<template v-for="node in data.nodes" :key="node.id">
			<flow-node
				:id="node.id"
				:node="node"
				:activeElement="activeElement"
				@nodeRightMenu="nodeRightMenu"
				@clickNode="clickNode"
				@deleteNode="deleteNode"
				@unlockNode="unlockNode"
				@addForkNode="addForkNode"
			>
			</flow-node>
		</template>
		<!-- 给画布一个默认的宽度和高度 -->
		<div style="position: absolute; top: 4000px; left: 4000px">&nbsp;</div>
	</div>
	<context-menu
		ref="contextMenu"
		@insertNode="insertNode"
		@editEdge="editEdge"
		@deleteEdge="deleteEdge"
	/>
</template>

<script>
import { defineComponent, ref } from "vue";
import FlowNode from "../node/FlowNode.vue";
import ContextMenu from "./ContextMenuPanel.vue";
import lodash from "lodash";
import { jsPlumb } from "jsplumb";
import $ from "jquery";

// import "jquery-ui/ui/widgets/droppable";
import { customAlphabet } from "nanoid";
import { jsplumbOptions } from "../core/options";
import { jsplumbSetting } from "../core/setting";
import { calcPosition } from "../core/util";
import { contextmenu } from "../core/contextmenu";

import {
	UnlockOutlined,
	LockOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
} from "@ant-design/icons-vue";
const nextId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

// const typeSize = {
// 	placeholder: [20, 80],
// 	start: [40, 80],
// 	forkGateway: [40, 120],
// 	joinGateway: [40, 120],
// };

export default defineComponent({
	components: {
		FlowNode,
		LockOutlined,
		UnlockOutlined,
		ZoomInOutlined,
		ZoomOutOutlined,
		ContextMenu,
	},
	props: ["flowData"],
	setup() {
		return {
			jsPlumb: null,
			// 控制画布销毁
			easyFlowVisible: true,
			// 控制流程数据显示与隐藏
			flowInfoVisible: false,
			// 是否加载完毕标志位
			loadEasyFlowFinish: false,
			flowHelpVisible: false,
			// 数据
			// 激活的元素、可能是节点、可能是连线
			data: ref({}),
			activeElement: {
				// 可选值 node 、line
				type: undefined,
				// 节点ID
				nodeId: undefined,
				// 连线ID
				sourceId: undefined,
				targetId: undefined,
			},
			zoom: 1,
			lock: ref(true),
		};
	},
	mixins: [jsplumbSetting, jsplumbOptions, contextmenu],
	emits: ["clickConditionEdge", "clickNode"],
	computed: {
		nodeMap() {
			let map = {};
			this.data.nodes.forEach((it) => {
				map[it.id] = it;
			});
			return map;
		},
		edgeMap() {
			let map = {};
			this.data.edges.forEach((it) => {
				map[it.source + "-" + it.target] = it;
			});
			return map;
		},
	},
	mounted() {
		this.data = this.flowData;
		this.jsPlumb = jsPlumb.getInstance();
		// this.bindDropEvent();
		this.$nextTick(() => {
			// 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
			this.dataReload(this.flowData);
		});
	},
	methods: {
		// initFlow() {

		// },
		jsPlumbInit() {
			this.jsPlumb.ready(() => {
				// 导入默认配置
				this.jsPlumb.importDefaults(this.jsplumbSetting);
				// 会使整个jsPlumb立即重绘。
				this.jsPlumb.setSuspendDrawing(false, true);
				// 初始化节点
				this.loadFlow();
				// 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
				// this.jsPlumb.bind("click", (conn) => {
				// 	console.log(conn);
				// });
				this.jsPlumb.bind("dblclick", (conn, e) => {
					let source = this.nodeMap[conn.sourceId];
					if (
						source &&
						(source.type === "exclusiveGateway" ||
							source.type === "forkGateway")
					) {
						this.$emit(
							"clickConditionEdge",
							this.edgeMap[conn.sourceId + "-" + conn.targetId]
						);
					} else {
						this.insertPlaceholder(conn, e);
					}
				});
				// 连线
				this.jsPlumb.bind("connection", (evt) => {
					let from = evt.source.id;
					let to = evt.target.id;
					this.data.edges.push({ source: from, target: to });
				});

				// 删除连线回调
				this.jsPlumb.bind("connectionDetached", (evt) => {
					this.deleteEdge(evt.sourceId, evt.targetId);
				});

				// 改变线的连接节点
				this.jsPlumb.bind("connectionMoved", (evt) => {
					this.changeLine(evt.originalSourceId, evt.originalTargetId);
				});

				// 连线右击
				this.jsPlumb.bind("contextmenu", (conn, e) => {
					e.preventDefault();
					this.$refs.contextMenu.show(e.clientX, e.clientY, conn);
				});

				// 连线
				this.jsPlumb.bind("beforeDrop", (evt) => {
					let from = evt.sourceId;
					let to = evt.targetId;
					if (from === to) {
						this.$message.error("节点不支持连接自己");
						return false;
					}
					if (this.hasLine(from, to)) {
						this.$message.error("该关系已存在,不允许重复创建");
						return false;
					}
					if (this.hashOppositeLine(from, to)) {
						this.$message.error("不支持两个节点之间连线回环");
						return false;
					}
					this.$message.success("连接成功");
					return true;
				});

				// beforeDetach
				this.jsPlumb.bind("beforeDetach", (evt) => {
					console.log("beforeDetach", evt);
				});
				this.jsPlumb.setContainer(this.$refs.flowContainer);
			});
		},

		initNode(node, add) {
			// 设置源点，可以拖出线连接其他节点
			if (node.type !== "output") {
				this.jsPlumb.makeSource(
					node.id,
					this.getSourceOptions(node.type)
				);
				if (add) {
					//新增节点是默认不能作为source
					this.jsPlumb.toggleSourceEnabled(node.id);
				}
			}

			// // 设置目标点，其他源点拖出的线可以连接该节点
			if (node.type !== "input") {
				this.jsPlumb.makeTarget(
					node.id,
					this.getTargetOptions(node.type)
				);
			}
			this.jsPlumb.draggable(node.id, {
				grid: [10, 10],
				containment: "parent",
			});
		},

		loadFlow() {
			// 初始化节点
			for (let i = 0; i < this.data.nodes.length; i++) {
				this.initNode(this.data.nodes[i]);
			}
			// 初始化连线
			for (let i = 0; i < this.data.edges.length; i++) {
				let line = this.data.edges[i];
				var connParam = {
					source: line.source,
					target: line.target,
					label: line.name ? line.name : "",
					connector: line.connector ? line.connector : "",
					anchors: line.anchors ? line.anchors : undefined,
					paintStyle: line.paintStyle ? line.paintStyle : undefined,
				};
				this.jsPlumb.connect(connParam, this.connectOptions);
			}
		},

		nodeRightMenu() {},
		clickNode(e) {
			this.$emit("clickNode", e);
		},
		addForkNode(e) {
			console.log(e);
		},
		dataReload(data) {
			this.easyFlowVisible = false;
			this.data.nodes = [];
			this.data.lines = [];
			this.$nextTick(() => {
				data = lodash.cloneDeep(data);
				this.easyFlowVisible = true;
				this.data = data;
				this.$nextTick(() => {
					this.jsPlumb = jsPlumb.getInstance();

					this.$nextTick(() => {
						this.jsPlumbInit();
					});
				});
			});
		},

		insertPlaceholder(conn, event) {
			let pos = calcPosition(
				event.clientX,
				event.clientY,
				this.$refs.flowContainer,
				"placeholder"
			);
			if (!pos) {
				return;
			}
			let id = "node" + nextId();
			let placeholder = {
				id,
				type: "placeholder",
				left: pos[0] + "px",
				top: pos[1] + "px",
				isAdd: true,
			};
			let newData = lodash.cloneDeep(this.data);
			newData.nodes.push(placeholder);
			this.data = newData;
			this.$nextTick(function () {
				this.initNode(placeholder, true);
				this.jsPlumb.deleteConnection(conn);
				this.jsPlumb.connect(
					{
						source: conn.sourceId,
						target: id,
					},
					this.connectOptions
				);

				if (!this.jsPlumb.isSourceEnabled(id)) {
					this.jsPlumb.toggleSourceEnabled(id);
				}
				this.jsPlumb.connect(
					{
						source: id,
						target: conn.targetId,
					},
					this.connectOptions
				);
			});
		},

		addNode(evt, nodeInfo) {
			let pos = calcPosition(
				evt.originalEvent.clientX,
				evt.originalEvent.clientY,
				this.$refs.flowContainer,
				nodeInfo.type
			);
			if (!pos) {
				this.$message.error("请把节点拖入到画布中");
				return;
			}
			var nodeId = "node" + nextId();
			// 动态生成名字

			var node = {
				id: nodeId,
				left: pos[0] + "px",
				top: pos[1] + "px",
				state: "success",
				isAdd: true,
				...nodeInfo,
			};
			/**
			 * 这里可以进行业务判断、是否能够添加该节点
			 */
			this.data.nodes.push(node);
			this.$nextTick(function () {
				this.initNode(node, true);
			});
		},

		deleteNode(id) {
			this.data.nodes = this.data.nodes.filter(function (item) {
				return item.id !== id;
			});
			let edges = [];

			let source, target;
			for (let i = 0; i < this.data.edges.length; i++) {
				let edge = this.data.edges[i];
				if (edge.source === id) {
					target = edge.target;
				} else if (edge.target === id) {
					source = edge.source;
				} else {
					edges.push(edge);
				}
			}
			this.data.edges = edges;
			this.jsPlumb.deleteConnectionsForElement(id);
			if (source && target) {
				this.jsPlumb.connect(
					{
						source,
						target,
					},
					this.connectOptions
				);
			}
		},

		deleteEdge() {
			console.log("delete edge");
		},

		updateEdge(edge) {
			console.log("update edge " + JSON.stringify(edge));
			let old;
			this.data.edges.forEach((it) => {
				if (it.source !== edge.source || it.target !== edge.target) {
					return;
				}
				old = lodash.cloneDeep(it);
				it = lodash.merge(it, edge);
			});
			if (old && old.name !== edge.name) {
				console.log("update label");
				//update label
				this.$nextTick(function () {
					this.jsPlumb.getAllConnections().forEach((conn) => {
						if (
							conn.sourceId === edge.source &&
							conn.targetId === edge.target
						) {
							conn.setLabel(edge.name);
						}
					});
				});
			}
		},
		updateNode(node) {
			this.data.nodes.forEach((it) => {
				if (it.id !== node.id) {
					return;
				}
				it = lodash.merge(it, node);
			});
		},

		unlockNode(id) {
			this.jsPlumb.toggleSourceEnabled(id);
		},

		unlockAll() {
			this.data.nodes.forEach(function (item) {
				if (this.jsPlumb.isSourceEnabled(item.id)) {
					this.jsPlumb.toggleSourceEnabled(item.id);
				}
			});
		},

		lockAll() {
			this.data.nodes.forEach(function (item) {
				if (!this.jsPlumb.isSourceEnabled(item.id)) {
					this.jsPlumb.toggleSourceEnabled(item.id);
				}
			});
		},

		allowDrop(e) {
			//修复放手后元素回退问题 https://segmentfault.com/a/1190000010078042
			e.preventDefault();
		},
		getFlowData() {
			let data = lodash.cloneDeep(this.data);

			let edgeMap = {};
			data.edges.forEach((it) => {
				edgeMap[it.source + "-" + it.target] = it;
			});
			let edges = [];
			this.jsPlumb.getAllConnections().forEach((conn) => {
				let edge = edgeMap[conn.sourceId + "-" + conn.targetId];
				edges.push(edge);
			});

			//获取实际位置来覆盖，这个最准确
			let nodePos = {};
			let nodeEls = $(".node-container");
			for (let i = 0; i < nodeEls.length; i++) {
				let el = $(nodeEls[i]);
				nodePos[el.attr("id")] = [el.css("left"), el.css("top")];
			}

			let nodes = [];
			data.nodes.forEach((it) => {
				delete it.isAdd;
				let pos = nodePos[it.id];
				it.left = pos[0];
				it.top = pos[1];
				nodes.push(it);
			});

			return { nodes, edges };
		},
		zoomAdd() {
			if (this.zoom >= 1) {
				return;
			}
			this.zoom = this.zoom + 0.1;
			// this.$refs.flowContainer.style.transform = `scale(${this.zoom})`;
			this.jsPlumb.setZoom(this.zoom);
		},
		zoomSub() {
			if (this.zoom <= 0) {
				return;
			}
			this.zoom = this.zoom - 0.1;
			this.$refs.flowContainer.style.transform = `scale(${this.zoom})`;
			this.jsPlumb.setZoom(this.zoom);
		},
	},
	directives: {
		flowDrag: {
			bind(el, binding) {
				if (!binding) {
					return;
				}
				el.onmousedown = (e) => {
					if (e.button == 2) {
						// 右键不管
						return;
					}
					//  鼠标按下，计算当前原始距离可视区的高度
					let disX = e.clientX;
					let disY = e.clientY;
					el.style.cursor = "move";

					document.onmousemove = function (e) {
						// 移动时禁止默认事件
						e.preventDefault();
						const left = e.clientX - disX;
						disX = e.clientX;
						el.scrollLeft += -left;

						const top = e.clientY - disY;
						disY = e.clientY;
						el.scrollTop += -top;
					};

					document.onmouseup = function () {
						el.style.cursor = "auto";
						document.onmousemove = null;
						document.onmouseup = null;
					};
				};
			},
		},
	},
});
</script>
<style>
#flow-container {
	background: url(https://img.alicdn.com/imgextra/i3/O1CN01LVUi4y1e6WRzwnhIh_!!6000000003822-55-tps-22-22.svg)
		0 0 repeat;
	background-repeat: repeat;
	background-size: 10px;
}
.container-toolbar {
	position: absolute;
	left: 10px;
	top: 10px;
}
.container-toolbar .container-toolbar-item {
	margin-left: 6px;
	padding: 4px 6px;
	border: 1px solid #dbdcdfc5;
	border-radius: 5px;
	font-size: 16px;
}
.container-toolbar-item:hover {
	cursor: pointer;
}

.flow-edge-label {
	padding: 4px 10px;
	background-color: white;
	color: #565758 !important;
	border: 1px solid #e0e3e7;
	border-radius: 5px;
	z-index: 1000;
	user-select: none;
}
</style>