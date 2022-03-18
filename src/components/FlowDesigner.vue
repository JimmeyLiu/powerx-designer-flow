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
				@clickConditionEdge="setNodeProperties"
				:flowData="flowData"
			/>
		</a-layout-content>
	</a-layout>

	<a-drawer
		:title="node.name"
		placement="right"
		width="720px"
		:maskStyle="{ backgroundColor: '#00000000' }"
		:visible="showPropertiesPanel"
		@close="closePropertiesPanel"
	>
		{{ node.name }}
	</a-drawer>
</template>
<script>
import { defineComponent, ref } from "vue";
import MainPanel from "./panel/MainPanel.vue";
import NodePanel from "./panel/NodePanel.vue";
// import PropertiesPanel from "./panel/PropertiesPanel.vue";

// import keymaster from "keymaster";
export default defineComponent({
	components: { MainPanel, NodePanel },
	props: ["flowData"],
	setup() {
		return {
			showPropertiesPanel: ref(false),
			node: ref({}),
		};
	},
	mounted() {
		// keymaster("⌘+s,ctrl+s", this.saveFlow);
	},
	methods: {
		setNodeProperties(node) {
			console.log("set " + node);
			this.node = node;
			this.showPropertiesPanel = true;
		},
		closePropertiesPanel() {
			this.showPropertiesPanel = false;
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
	},
});
</script>
<style>
</style>