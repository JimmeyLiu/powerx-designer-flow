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
			<div :class="titleClass">
				<span class="node-box-icon">
					<DownloadOutlined v-if="node.type === 'input'" />
					<UploadOutlined v-else-if="node.type === 'output'" />
					<ForkOutlined v-else-if="node.type === 'joinGateway'" />
					<ForkOutlined
						style="
							transform: rotate(180deg);
							-webkit-transform: rotate(180deg);
						"
						v-else-if="node.type === 'forkGateway'"
					/>
					<BranchesOutlined
						v-else-if="node.type === 'exclusiveGateway'"
					/>
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
			<span class="node-toolbar-item" v-if="editAble" @click="clickNode"
				><EditOutlined />
			</span>
			<span
				class="node-toolbar-item"
				v-if="plusAble"
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
import { nodeConfig } from "../core/nodes";
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
			return nodeConfig[this.node.type].lockAble;
		},
		editAble() {
			return nodeConfig[this.node.type].editAble;
		},
		deleteAble() {
			return nodeConfig[this.node.type].deleteAble;
		},
		plusAble() {
			return nodeConfig[this.node.type].plusAble;
		},
		nodeContainerClass() {
			return ["node-container", "node-" + this.node.type];
		},
		titleClass() {
			return nodeConfig[this.node.type].titleCenter
				? ["node-box-title", "node-box-title-center"]
				: ["node-box-title", "node-box-title-left"];
		},
	},
	emits: ["clickNode", "addForkNode"],
	methods: {
		// 点击节点
		clickNode() {
			if (
				this.node.type.indexOf("Gateway") < 0 &&
				this.node.type !== "placeholder"
			) {
				this.$emit("clickNode", this.node);
			}
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
			this.$confirm({
				title: "是否删除该节点",
				content: "再次确认是否要删除",
				okText: "删除",
				cancelText: "取消",
				onOk: () => {
					this.$emit("deleteNode", this.node.id);
				},
			});
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
.node-exclusiveGateway,
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
	flex: 1;
	padding: 6px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: #000000d9;
	font-weight: 500;
	font-size: 16px;
	user-select: none;
}
.node-box-title-left {
	display: inline-block;
}
.node-box-title-center {
	display: flex;
	justify-content: center;
	text-align: center;
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