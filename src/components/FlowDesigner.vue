<template>
	<a-layout>
		<a-layout-sider width="140" style="background: #fff">
			<node-panel @addNode="addNode" />
		</a-layout-sider>
		<a-layout-content
			:style="{
				display: 'flex',
				background: '#fff',
				padding: '0',
				'margin-left': '1px',
				height: 'calc(100vh - 50px)',
			}"
		>
			<main-panel
				ref="mainPanel"
				@clickNode="setNodeProperties"
				@clickConditionEdge="setEdgeProperties"
				:flowData="flowData"
			/>
		</a-layout-content>
	</a-layout>

	<a-drawer
		placement="right"
		width="500px"
		:maskStyle="{ backgroundColor: '#00000000' }"
		:visible="showSetterPanel"
		@close="closeSetterPanel"
	>
		<template #title>
			<span v-if="type === 'edge'">编辑条件 </span>
			<span v-else-if="data">{{ data.name }}</span>
		</template>
		<setter-panel ref="setterPanel" :type="type" :data="data" />
		<div
			:style="{
				position: 'absolute',
				left: 0,
				bottom: 0,
				width: '100%',
				borderTop: '1px solid #e9e9e9',
				padding: '10px 16px',
				background: '#fff',
				textAlign: 'left',
				zIndex: 1,
			}"
		>
			<a-button
				type="primary"
				style="margin-right: 8px"
				@click="saveSetter"
				>保存</a-button
			>
			<a-button @click="closeSetterPanel">取消</a-button>
		</div>
	</a-drawer>
</template>
<script>
import { defineComponent, ref } from "vue";
import MainPanel from "./panel/MainPanel.vue";
import NodePanel from "./panel/NodePanel.vue";
import SetterPanel from "./panel/SetterPanel.vue";

export default defineComponent({
	components: { MainPanel, NodePanel, SetterPanel },
	props: ["flowData"],
	setup() {
		return {
			showSetterPanel: ref(false),
			type: ref({}),
			data: ref({}),
		};
	},
	mounted() {
		// keymaster("⌘+s,ctrl+s", this.saveFlow);
	},
	methods: {
		setNodeProperties(node) {
			this.data = node;
			this.type = "node";
			this.showSetterPanel = true;
		},
		setEdgeProperties(conn) {
			this.data = conn;
			this.type = "edge";
			this.showSetterPanel = true;
		},
		closeSetterPanel() {
			this.showSetterPanel = false;
		},
		addNode(event, nodeType) {
			this.$refs.mainPanel.addNode(event, nodeType);
		},
		saveFlow() {
			console.log("save node");
		},
		getFlowData() {
			return this.$refs.mainPanel.getFlowData();
		},
		saveSetter() {
			let data = this.$refs.setterPanel.getSetterData();
			if (this.type === "edge") {
				this.$refs.mainPanel.updateEdge(data);
			} else {
				this.$refs.mainPanel.updateNode(data);
			}
			this.closeSetterPanel();
		},
	},
});
</script>
<style>
</style>