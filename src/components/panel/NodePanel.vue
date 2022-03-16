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
					<div class="component-item" x-component="EntityFormItem">
						{{ item.title }}
					</div>
				</a-list-item>
			</template>
		</a-list>
	</div>
</template>
<script>
import { defineComponent } from "vue";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";

const data = [
	{
		title: "Title 1",
	},
	{
		title: "Title 2",
	},
	{
		title: "Title 3",
	},
	{
		title: "Title 4",
	},
	{
		title: "Title 5",
	},
	{
		title: "Title 6",
	},
];
export default defineComponent({
	setup() {
		return {
			data,
		};
	},
	mounted() {
		$(".component-item").draggable({
			helper: "clone",
			scroll: true,
			cursor: "move",
			start: function () {
				console.log("start");
			},
			stop: function () {},
		});
	},

	methods: {},
});
</script>
<style>
.component-item {
	height: 36px;
	line-height: 36px;
	justify-content: center;
	width: 110px;
	padding-left: 8px;
	margin: 0 4px;
	background: #fff;
	border: 1px solid #e5e6e8;
	border-radius: 6px;
	background-color: #fff;
}
.component-item:hover {
	cursor: pointer;
}
.node-panel {
	padding: 10px;
}
</style>