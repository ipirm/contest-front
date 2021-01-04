<template>
  <div v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper">
      <div class="swiper-slide" :key="`${searchNumber}-${participant.userId}-${k}`" v-for="(image, k) in participant.images">
        <img class="swiper-lazy" :src="image.url" :alt="participant.user.name + ' ' + participant.user.last_name">
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "AdminSwiper",

  props: ['participant'],

  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 10,
        lazy: {
          loadPrevNext: true
        }
      }
    }
  },

  computed: {
    ...mapState(['searchNumber'])
  }
}
</script>
