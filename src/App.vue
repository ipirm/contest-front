<template>
	<div> 
		<Header />
		<transition name="fade" mode="out-in">
			<router-view class="page" />
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

	mounted() {
		let watchForHover = () => {
      let hasHoverClass = false;
      let container = document.body;
      let lastTouchTime = 0;

      let enableHover = () => {
        // discard emulated mouseMove events coming from touch events
        if (new Date() - lastTouchTime < 500) return;
        if (hasHoverClass) return;

        container.classList.remove("touch");
        hasHoverClass = true;
      };

      let disableHover = () => {
        if (!hasHoverClass) return;

        container.classList.add("touch");
        hasHoverClass = false;
      };

      let updateLastTouchTime = () => {
        lastTouchTime = new Date();
      };

      document.addEventListener("touchstart", updateLastTouchTime, true);
      document.addEventListener("touchstart", disableHover, true);
      document.addEventListener("mousemove", enableHover, true);

      enableHover();
    };

    watchForHover();
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
