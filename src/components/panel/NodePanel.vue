<template>
	<div class="node-panel">
		<a-list
			:grid="{
				gutter: 2,
				xs: 2,
				wrap: true,
			}"
			:data-source="data"
		>
			<template #renderItem="{ item }">
				<a-list-item>
					<!-- <a-card :title="item.title">Card content</a-card> -->
					<draggable
						@end="end"
						@start="start"
						:options="draggableOptions"
						:move="checkMove"
					>
						<div
							class="node-item"
							:ntype="item.type"
							:name="item.name"
						>
							<DownloadOutlined v-if="item.type === 'input'" />
							<UploadOutlined
								v-else-if="item.type === 'output'"
							/>
							<BranchesOutlined
								v-else-if="item.type === 'exclusiveGateway'"
							/>
							<ForkOutlined
								style="
									transform: rotate(180deg);
									-webkit-transform: rotate(180deg);
								"
								v-else-if="item.type === 'forkGateway'"
							/>
							<ForkOutlined
								v-else-if="item.type === 'joinGateway'"
							/>
							<DatabaseOutlined
								v-else-if="item.type === 'database'"
							/>
							<SendOutlined v-else-if="item.type === 'message'" />
							<FunctionOutlined v-else />
							{{ item.name }}
						</div>
					</draggable>
				</a-list-item>
			</template>
		</a-list>
	</div>
</template>
<script>
import { defineComponent, ref } from "vue";
// import $ from "jquery";
// import "jquery-ui/ui/widgets/draggable";
import { VueDraggableNext } from "vue-draggable-next";
import { nodes } from "../core/nodes";
import {
	ForkOutlined,
	DownloadOutlined,
	UploadOutlined,
	BranchesOutlined,
	FunctionOutlined,
	DatabaseOutlined,
	SendOutlined,
} from "@ant-design/icons-vue";

var mousePosition = {
	left: -1,
	top: -1,
};
export default defineComponent({
	components: {
		draggable: VueDraggableNext,
		ForkOutlined,
		DownloadOutlined,
		UploadOutlined,
		BranchesOutlined,
		FunctionOutlined,
		DatabaseOutlined,
		SendOutlined,
	},
	setup() {
		return {
			data: nodes,
			nodeType: ref(""),
			draggableOptions: ref({
				preventOnFilter: false,
				sort: false,
				disabled: false,
				ghostClass: "tt",
				// 不使用H5原生的配置
				forceFallback: true,
				fallbackClass: "draggingStyle",
				// 拖拽的时候样式
				// fallbackClass: 'flow-node-draggable'
			}),
		};
	},

	created() {
		/**
		 * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
		 * @param event
		 */
		if (this.isFirefox()) {
			document.body.ondrop = function (event) {
				// 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
				mousePosition.left = event.layerX;
				mousePosition.top = event.clientY - 50;
				event.preventDefault();
				event.stopPropagation();
			};
		}
	},
	methods: {
		end(event) {
			let type = event.item.getAttribute("ntype");
			let name = event.item.getAttribute("name");
			this.$emit("addNode", event, { type, name });
		},
		start(evt) {
			console.log(evt);
			this.nodeType = "service";
		},
		isFirefox() {
			var userAgent = navigator.userAgent;
			if (userAgent.indexOf("Firefox") > -1) {
				return true;
			}
			return false;
		},
		checkMove(e) {
			console.log(e);
		},
	},
});
</script>
<style>
.node-item {
	height: 32px;
	line-height: 32px;
	width: 100px;
	padding-left: 8px;
	margin: 0 4px;
	background: #fff;
	border: 1px dashed #e5e6e8;
	border-radius: 6px;
	background-color: #fff;
}
.node-item:hover {
	cursor: pointer;
}
.node-panel {
	padding: 10px;
}
</style>