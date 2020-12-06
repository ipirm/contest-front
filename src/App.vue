<template>
	<div>
		<Header />
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
		<Footer />
		<transition name="fade" mode="out-in">
			<div class="full-page-loading" v-if="searchLoading">
				<img svg-inline class="icon svg-stroke-color" src="@/assets/icons/dual-ring.svg" alt="loading" />
			</div>
		</transition>
	</div>
</template>
<script>
import {mapState} from 'vuex'

export default {
	name: 'App',

	components: {
		Header: () => import('@/components/default/Header'),
		Footer: () => import('@/components/default/Footer'),
	},

	computed: {
		...mapState(['searchLoading'])
	}
}

</script>
<style lang="scss">
@import "@/assets/scss/app.scss";
@import "@/assets/scss/media.scss";

</style>
