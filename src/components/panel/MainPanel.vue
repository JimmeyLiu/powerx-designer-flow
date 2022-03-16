<template>
	<div id="flow-container" ref="flowContainer" class="container">
		<template v-for="node in data.nodeList" :key="node.id" v-drag>
			<flow-node
				:id="node.id"
				:node="node"
				:activeElement="activeElement"
				@changeNodeSite="changeNodeSite"
				@nodeRightMenu="nodeRightMenu"
				@clickNode="clickNode"
			>
			</flow-node>
		</template>
		<!-- 给画布一个默认的宽度和高度 -->
		<div style="position: absolute; top: 2000px; left: 2000px">&nbsp;</div>
	</div>
</template>

<script>
import { defineComponent, ref } from "vue";
import FlowNode from "../node/FlowNode.vue";
import { getData } from "../../sample/data";
import lodash from "lodash";
import { jsPlumb } from "jsplumb";
import $ from "jquery";
import "jquery-ui/ui/widgets/droppable";
import { customAlphabet } from "nanoid";
import { easyFlowMixin } from "./mixins";

const nextId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

export default defineComponent({
	components: { FlowNode },
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
			data: ref({}),
			// 激活的元素、可能是节点、可能是连线
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
		};
	},
	mixins: [easyFlowMixin],
	mounted() {
		// this.initFlow();
		this.jsPlumb = jsPlumb.getInstance();
		this.bindDropEvent();
		this.$nextTick(() => {
			// 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
			this.dataReload(getData());
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
				this.jsPlumb.bind("click", (conn) => {
					this.activeElement.type = "line";
					this.activeElement.sourceId = conn.sourceId;
					this.activeElement.targetId = conn.targetId;
					this.$refs.nodeForm.lineInit({
						from: conn.sourceId,
						to: conn.targetId,
						label: conn.getLabel(),
					});
				});
				// 连线
				this.jsPlumb.bind("connection", (evt) => {
					let from = evt.source.id;
					let to = evt.target.id;
					if (this.loadEasyFlowFinish) {
						this.data.lineList.push({ from: from, to: to });
					}
				});

				// 删除连线回调
				this.jsPlumb.bind("connectionDetached", (evt) => {
					this.deleteLine(evt.sourceId, evt.targetId);
				});

				// 改变线的连接节点
				this.jsPlumb.bind("connectionMoved", (evt) => {
					this.changeLine(evt.originalSourceId, evt.originalTargetId);
				});

				// 连线右击
				this.jsPlumb.bind("contextmenu", (evt) => {
					console.log("contextmenu", evt);
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
		loadFlow() {
			// 初始化节点
			for (let i = 0; i < this.data.nodeList.length; i++) {
				let node = this.data.nodeList[i];
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
			// 初始化连线
			for (let i = 0; i < this.data.lineList.length; i++) {
				let line = this.data.lineList[i];
				var connParam = {
					source: line.from,
					target: line.to,
					label: line.label ? line.label : "",
					connector: line.connector ? line.connector : "",
					anchors: line.anchors ? line.anchors : undefined,
					paintStyle: line.paintStyle ? line.paintStyle : undefined,
				};
				this.jsPlumb.connect(connParam, this.jsplumbConnectOptions);
			}
			this.$nextTick(function () {
				this.loadEasyFlowFinish = true;
			});
		},
		changeNodeSite() {},
		nodeRightMenu() {},
		clickNode() {},
		dataReload(data) {
			this.easyFlowVisible = false;
			this.data.nodeList = [];
			this.data.lineList = [];
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

		bindDropEvent() {
			let flowContainer = this.$refs.flowContainer;
			let _jsPlumb = this.jsPlumb;
			$("#flow-container").droppable({
				over: function (event, ui) {
					console.log(ui.position);
				},
				drop: function (event) {
					let left = event.originalEvent.clientX;
					let top = event.originalEvent.clientY;

					let container = this.getBoundingClientRect();
					left = left - container.x + flowContainer.scrollLeft;
					top = top - container.y + flowContainer.scrollTop;
					let copy = $("#EntityFormItem").clone();
					let id = "node" + nextId();
					copy.attr("id", id);
					left -= 85;
					top -= 16;
					copy.addClass("ef-node-container");
					copy.css("top", top);
					copy.css("left", left);
					$(this).append(copy);
					_jsPlumb.draggable(id);
				},
			});
		},
	},
});
</script>