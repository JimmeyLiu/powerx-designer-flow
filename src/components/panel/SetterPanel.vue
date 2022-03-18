<template>
	<condition-setter ref="edgeSetter" v-if="type === 'edge'" :edge="data" />
	<template v-else>
		<database-setter
			ref="databaseSetter"
			v-if="data.type === 'database'"
			:node="data"
		/>
		<service-setter
			ref="serviceSetter"
			v-if="data.type === 'service'"
			:node="data"
		/>
	</template>
</template>
<script>
import { defineComponent } from "vue";
import ConditionSetter from "../node/ConditionSetter.vue";
import DatabaseSetter from "../node/DatabaseSetter.vue";
import ServiceSetter from "../node/ServiceSetter.vue";
export default defineComponent({
	components: { ConditionSetter, DatabaseSetter, ServiceSetter },
	setup() {
		return {};
	},
	props: ["type", "data"],
	methods: {
		getSetterData() {
			let refName =
				this.type === "edge" ? "edgeSetter" : this.data.type + "Setter";
			return this.$refs[refName].getData();
		},
	},
});
</script>