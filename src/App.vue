<template>
	<!-- <Designer /> -->
	<a-layout>
		<a-layout-header
			class="header"
			style="height: 48px; line-height: 48px; background: #fff"
		>
			<div>
				<a-button type="primary" @click="saveData">保存</a-button>
			</div>
		</a-layout-header>
		<a-layout-content
			:style="{
				padding: '1px',
				margin: 0,
				height: 'calc(100vh - 50px)',
			}"
		>
			<flow-designer ref="flowDesigner" :flowData="flowData" />
		</a-layout-content>
	</a-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

import FlowDesigner from "./components/FlowDesigner.vue";
export default defineComponent({
	name: "App",
	components: {
		FlowDesigner,
	},
	setup() {
		return {
			flowData: ref({
				nodes: [
					{
						id: "input",
						name: "输入",
						type: "input",
						left: "400px",
						top: "30px",
					},
				],
				edges: [],
			}),
		};
	},
	mounted() {
		let data = localStorage.getItem("flowData");
		if (data) {
			this.flowData = JSON.parse(data);
		}
		console.log(this.flowData);
	},
	methods: {
		saveData() {
			localStorage.setItem(
				"flowData",
				JSON.stringify(this.$refs.flowDesigner.getFlowData())
			);
			this.$message.success("保存成功");
		},
	},
});
</script>