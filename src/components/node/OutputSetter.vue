<template>
	<div
		ref="node"
		:style="nodeStyle"
		@dblclick="clickNode"
		:class="nodeContainerClass"
		@mouseup="onMoved"
		size="small"
	>
		<div class="node-box" v-if="node.type !== 'placeholder'">
			<div class="node-box-title">
				<span class="node-box-icon">
					<DownloadOutlined v-if="node.type === 'input'" />
					<UploadOutlined v-else-if="node.type === 'output'" />
					<ForkOutlined v-else-if="node.type === 'joinGateway'" />
					<BranchesOutlined v-else-if="node.type === 'forkGateway'" />
					<DatabaseOutlined v-else-if="node.type === 'database'" />
					<SendOutlined v-else-if="node.type === 'message'" />
					<FunctionOutlined v-else /> </span
				>{{ node.name }}
			</div>

			<div
				v-if="
					node.type === 'service' ||
					node.type === 'database' ||
					node.type === 'message'
				"
				class="node-box-content"
			>
				这是内容
			</div>
		</div>
		<div class="pushpin" v-else>
			<PushpinOutlined />
		</div>
		<div class="node-toolbar">
			<span
				class="node-toolbar-item"
				v-if="lockAble && isLocked"
				@click="unlockNode"
				><UnlockOutlined
			/></span>
			<span
				class="node-toolbar-item"
				v-else-if="lockAble"
				@click="unlockNode"
				><LockOutlined
			/></span>
			<span
				class="node-toolbar-item"
				v-if="deleteAble"
				@click="deleteNode"
				><DeleteOutlined
			/></span>
			<span
				class="node-toolbar-item"
				v-if="
					node.type !== 'placeholder' &&
					node.type !== 'forkGateway' &&
					node.type !== 'joinGateway'
				"
				@click="clickNode"
				><EditOutlined />
			</span>
			<span
				class="node-toolbar-item"
				v-if="node.type === 'forkGateway'"
				@click="addForkChild"
				><PlusOutlined />
			</span>
		</div>
	</div>
</template>

<script>
import {
	ForkOutlined,
	DeleteOutlined,
	UnlockOutlined,
	LockOutlined,
	EditOutlined,
	PushpinOutlined,
	DownloadOutlined,
	UploadOutlined,
	BranchesOutlined,
	FunctionOutlined,
	DatabaseOutlined,
	SendOutlined,
	PlusOutlined,
} from "@ant-design/icons-vue";

export default {
	components: {
		ForkOutlined,
		DeleteOutlined,
		UnlockOutlined,
		LockOutlined,
		EditOutlined,
		PushpinOutlined,
		UploadOutlined,
		DownloadOutlined,
		BranchesOutlined,
		FunctionOutlined,
		DatabaseOutlined,
		SendOutlined,
		PlusOutlined,
	},
	props: {
		node: Object,
		activeElement: Object,
	},
	data() {
		return {
			nodeStyle: {},
			locked: false,
		};
	},
	mounted() {
		this.nodeStyle = { top: this.node.top, left: this.node.left };
	},
	computed: {
		isLocked() {
			return this.node.isAdd ? !this.locked : this.locked;
		},
		lockAble() {
			return this.node.type !== "input" && this.node.type !== "output";
		},
		deleteAble() {
			return this.node.type !== "input";
		},
		nodeContainerClass() {
			return ["node-container", "node-" + this.node.type];
		},
		// 节点容器样式

		nodeIcoClass() {
			var nodeIcoClass = {};
			nodeIcoClass[this.node.ico] = true;
			// 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
			nodeIcoClass["flow-node-drag"] = this.node.viewOnly ? false : true;
			return nodeIcoClass;
		},
	},
	emits: ["clickNode", "addForkNode"],
	methods: {
		// 点击节点
		clickNode() {
			this.$emit("clickNode", this.node);
		},
		addForkChild() {
			this.$emit("addForkNode", this.node);
		},
		// 鼠标移动后抬起
		onMoved() {
			let left = this.$refs.node.style.left;
			let top = this.$refs.node.style.top;
			if (
				!this.$refs.node.style ||
				(this.node.left == left && this.node.top == top)
			) {
				return;
			}

			this.nodeStyle.top = top;
			this.nodeStyle.left = left;
		},
		deleteNode() {
			if (this.node.type === "placeholder") {
				this.$emit("deleteNode", this.node.id);
				return;
			}
			// let style =
			// 	"top: " + this.node.top + "px;left:" + this.node.left + "px";
			// this.$confirm({
			// 	title: "是否删除该节点",
			// 	content: "再次确认是否要删除",
			// 	okText: "删除",
			// 	cancelText: "取消",
			// 	dialogStyle: {
			// 		top: this.node.top + "px",
			// 		left: this.node.left + "px",
			// 	},
			// 	bodyStyle: {
			// 		top: this.node.top + "px",
			// 		left: this.node.left + "px",
			// 	},
			// 	onOk() {
			// 		this.$emit("deleteNode", this.node.id);
			// 	},
			// 	onCancel() {},
			// });
			this.$confirm({
				title: "是否删除该节点",
				content: "再次确认是否要删除",
				okText: "删除",
				cancelText: "取消",
				onOk: () => {
					this.$emit("deleteNode", this.node.id);
				},
			});
			// let confirm = $(
			// 	".ant-modal-root .ant-modal-confirm .ant-modal-content"
			// );
			// console.log(confirm.length);
		},
		unlockNode() {
			this.nodeStyle.top = this.$el.style.top;
			this.nodeStyle.left = this.$el.style.left;
			this.locked = !this.locked;
			this.$emit("unlockNode", this.node.id);
		},
	},
};
</script>

<style>
.node-container {
	position: absolute;
	border: 1px solid #e0e3e7;
	background-color: #fff;
}

.node-input,
.node-output {
	height: 40px;
	width: 120px;
	border-radius: 15px;
}
.node-message,
.node-database,
.node-service {
	height: 80px;
	width: 220px;
	border-radius: 5px;
}
.node-forkGateway,
.node-joinGateway {
	height: 40px;
	width: 120px;
	border-radius: 5px;
}
.node-placeholder {
	height: 30px;
	width: 80px;
	border-radius: 5px;
	border: 0;
	background-color: rgba(245, 238, 238, 0);
}

.node-placeholder .pushpin {
	justify-content: center;
	text-align: center;
	font-size: 18px;
}

.node-container:hover {
	/* 设置移动样式*/
	cursor: move;
	background-color: #f0f7ff;
	/*box-shadow: #1879FF 0px 0px 12px 0px;*/
	background-color: #f0f7ff;
	border: 1px dashed #1879ff;
}

.node-box-icon {
	padding-right: 4px;
}
.node-box-title {
	display: inline-block;
	flex: 1;
	padding: 6px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: #000000d9;
	font-weight: 500;
	font-size: 16px;
}

.node-input .node-box-title,
.node-output .node-box-title {
	text-align: center;
	justify-content: center;
}

.node-box-content {
	flex: 1;
	overflow: hidden;
	padding: 0 8px;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: #36353594;
	font-weight: 500;
	font-size: 15px;
}

.node-toolbar {
	position: absolute;
	top: -26.5px;
	right: 0;
	z-index: 2;
	cursor: pointer;
	opacity: 0;
	-webkit-transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.node-container:hover .node-toolbar {
	opacity: 1;
}

.node-toolbar .node-toolbar-item {
	margin-left: 6px;
	padding: 4px;
	color: #e0e3e7;
	background: #1879ffde;
	border-radius: 5px;
}
</style>