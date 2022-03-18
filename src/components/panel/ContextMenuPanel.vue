<template>
	<div
		class="flow-context-menu ant-popover ant-popover-placement-rightTop"
		:style="popoverStyle"
	>
		<div class="ant-popover-content" ref="popoverContent">
			<div class="ant-popover-arrow">
				<span class="ant-popover-arrow-content"></span>
			</div>
			<div class="ant-popover-inner" role="tooltip">
				<div>
					<div class="ant-popover-title"><span>连线操作</span></div>
					<div class="ant-popover-inner-content">
						<a-button
							v-if="isEditableEdge"
							class="btn-item"
							type="primary"
							@click="editEdge"
							><template #icon> <EditOutlined /> </template>
							编辑属性</a-button
						>
						<a-button
							class="btn-item"
                            type="primary"
                            danger
							@click="deleteEdge"
							><template #icon> <DeleteOutlined /> </template
							>删除连线</a-button
						>

						<div class="menu-title">插入节点</div>
						<template v-for="item in data" :key="item.type">
							<a-button
								class="btn-item"
								@click="insertNode(item)"
							>
								<template #icon>
									<DownloadOutlined
										v-if="item.type === 'input'"
									/>
									<UploadOutlined
										v-else-if="item.type === 'output'"
									/>
									<ForkOutlined
										v-else-if="item.type === 'joinGateway'"
									/>
									<BranchesOutlined
										v-else-if="item.type === 'forkGateway'"
									/>
									<DatabaseOutlined
										v-else-if="item.type === 'database'"
									/>
									<SendOutlined
										v-else-if="item.type === 'message'"
									/>
									<FunctionOutlined v-else />
								</template>

								{{ item.name }}
							</a-button>
						</template>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flow-context-menu-mask" :style="maskStyle" @click="hide"></div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { nodes } from "../core/nodes";
import {
	ForkOutlined,
	DownloadOutlined,
	UploadOutlined,
	BranchesOutlined,
	FunctionOutlined,
	DatabaseOutlined,
	SendOutlined,
	EditOutlined,
	DeleteOutlined,
} from "@ant-design/icons-vue";

export default defineComponent({
	components: {
		ForkOutlined,
		DownloadOutlined,
		UploadOutlined,
		BranchesOutlined,
		FunctionOutlined,
		DatabaseOutlined,
		SendOutlined,
		EditOutlined,
		DeleteOutlined,
	},
	setup() {
		return {
			data: ref(nodes),
			showMenu: ref(false),
			left: ref("-1000px"),
			top: ref("-1000px"),
			conn: ref(null),
		};
	},
	emits: ["insertNode", "editEdge", "deleteEdge"],
	computed: {
		popoverStyle() {
			return {
				top: this.top,
				left: this.left,
				display: this.showMenu ? "block" : "none",
			};
		},
		maskStyle() {
			return {
				display: this.showMenu ? "block" : "none",
			};
		},
		isEditableEdge() {
			return true;
		},
	},
	methods: {
		show(left, top, conn) {
			this.left = left + "px";
			this.top = top + "px";
			this.showMenu = true;
			this.conn = conn;
		},
		hide() {
			console.log("hide menu");
			this.showMenu = false;
		},
		insertNode(node) {
			console.log("insert node " + JSON.stringify(node));
			this.$emit("insertNode", {
				node,
				top: this.top,
				left: this.left,
				conn: this.conn,
			});
			this.showMenu = false;
		},
		editEdge() {
			this.$emit("editEdge", this.conn);
			this.showMenu = false;
		},
		deleteEdge() {
			this.$emit("deleteEdge", this.conn);
			this.showMenu = false;
		},
	},
});
</script>
<style>
.flow-context-menu {
	z-index: 10000 !important;
	position: fixed !important;
	width: 280px;
}
.btn-item {
	justify-content: center;
	margin: 4px;
}
.menu-title {
	margin: 10px 0;
	font-size: 16px;
}
.flow-context-menu-mask {
	z-index: 9000 !important;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 0;
	background-color: rgba(0, 0, 0, 0);
	filter: alpha(opacity=45);
	transition: opacity 0.3s linear, height 0s ease 0.3s;
	height: 100%;
	opacity: 1;
	transition: none;
	-webkit-animation: antdDrawerFadeIn 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
	animation: antdDrawerFadeIn 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
}
</style>