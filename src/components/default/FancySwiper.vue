<template>
  <div class="overlay-swiper" @click="closeModal">
    <div class="overlay-swiper__bg"></div>
    <div class="overlay-swiper-row">
      <div class="overlay-swiper_text cursor-pointer" @click="closeModal">
        <span v-t="'close'" />
      </div>
      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :key="i" v-for="(banner, i) in banners">
            <img :src="banner.url" :alt="banner.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FancySwiper",

  props: ['banners'],

  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
        grabCursor: true,
        // observer: true,
        // observeParents: true
      }
    };
  },

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.mySwiper.slideTo(0);
      }, 500)
    });
  },

  methods: {
    closeModal() {
      this.$emit("closePopup");
      this.mySwiper.destroy();
    }
  }
};
</script>
