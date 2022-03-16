<template>
	<a-layout>
		<a-layout-header
			class="header"
			style="height: 48px; line-height: 48px; background: #fff"
		>
			<div>
				<img width="32" src="@/assets/logo.png" />
			</div>
		</a-layout-header>
		<a-layout class="main">
			<a-layout-sider width="260" style="background: #fff">
				<node-panel />
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
				<main-panel />
			</a-layout-content>
			<a-layout-sider
				width="300"
				style="background: #fff; margin-left: 1px"
			>
			</a-layout-sider>
		</a-layout>
	</a-layout>
</template>
<script>
import { defineComponent } from "vue";
import MainPanel from "./panel/MainPanel.vue";
import NodePanel from "./panel/NodePanel.vue";

export default defineComponent({
	components: { MainPanel, NodePanel },

	setup() {},
});
</script>
<style>
#components-layout-demo-top-side-2 .logo {
	float: left;
	width: 120px;
	height: 31px;
	margin: 16px 24px 16px 0;
	background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
	float: right;
	margin: 16px 0 16px 24px;
}

.site-layout-background {
	background: #fff;
}
.header {
	height: 48px;
	line-height: 48px;
	background: #fff;
}
.main {
	margin-top: 2px;
}
.left-icon-item {
	padding: "10px 0";
}
.ant-drawer-left.ant-drawer-open .ant-drawer-content-wrapper {
	box-shadow: 0;
}
.wrapper {
	box-shadow: 0 0 0 rgb(0 0 0 / 15%) !important;
	margin: "50px 0 0 49px";
}
.ant-drawer-close {
	width: 40px !important;
	height: 40px !important;
	line-height: 40px !important;
	font-size: 14px !important;
}
.ant-drawer-content-wrapper {
	box-shadow: 0 0 1px rgb(0 0 0 / 15%) !important;
}
.ant-drawer-body {
	padding: 10px !important;
}
.ant-tabs-nav .ant-tabs-tab {
	padding: 10px 16px !important;
}
.ant-tabs-content {
	padding: 10px;
	height: calc(100vh - 120px);
	overflow-y: scroll;
}
.ant-drawer-body {
	padding: 10px;
	height: calc(100vh - 120px);
	overflow-y: scroll;
}
.ant-layout-header {
	padding: 0 8px !important;
}
</style>