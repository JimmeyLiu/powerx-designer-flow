<template>
	<a-drawer
		title="节点编辑"
		placement="right"
		width="600px"
		:visible="visible"
		:mask="false"
		@close="close"
		:headerStyle="{
			height: '40px',
			lineHeight: '40px',
			padding: '10px 10px',
		}"
		:wrap-style="{ position: 'absolute' }"
	>
		{{ node.name }}
	</a-drawer>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
	components: {},
	props: ["visible", "node"],
	setup() {
		return {};
	},
	methods: {
		close() {
			this.$emit("close");
		},
	},
});
</script>