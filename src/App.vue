<template>
	<div>
		<Header />
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
		<Footer />
	</div>
</template>
<script>
export default {
	name: 'App',

	components: {
		Header: () => import('@/components/default/Header'),
		Footer: () => import('@/components/default/Footer'),
	}
}

</script>
<style lang="scss">
@import "@/assets/scss/app.scss";
@import "@/assets/scss/media.scss";

</style>
