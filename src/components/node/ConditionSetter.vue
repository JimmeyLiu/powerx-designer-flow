<template>
	<a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
		<a-form-item label="条件名称">
			<a-input v-model:value="form.name" />
		</a-form-item>
		<a-form-item label="条件类型">
			<a-select
				v-model:value="form.conditionType"
				placeholder="please select your zone"
			>
				<a-select-option value="shanghai">Zone one</a-select-option>
				<a-select-option value="beijing">Zone two</a-select-option>
			</a-select>
		</a-form-item>
		<a-form-item label="规则配置">
			<a-date-picker
				v-model:value="form.condition"
				show-time
				type="date"
				placeholder="Pick a date"
				style="width: 100%"
			/>
		</a-form-item>
	</a-form>
</template>
<script>
import { defineComponent, ref } from "vue";
import lodash from "lodash";
export default defineComponent({
	props: ["edge"],
	setup() {
		return {
			labelCol: {
				span: 4,
			},
			wrapperCol: {
				span: 14,
			},
			form: ref({}),
		};
	},
	watch: {
		edge() {
			this.form = lodash.cloneDeep(this.edge);
		},
	},
	mounted() {
		this.form = lodash.cloneDeep(this.edge);
	},
	methods: {
		getData() {
			return this.form;
		},
	},
});
</script>