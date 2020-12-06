<template>
  <div>
    <FancySwiper v-body-scroll-lock="activePhoto !== -1" v-if="activePhoto === index" @closePopup="$emit('close-popup-parent')" :banners="item.images" />
    <div class="participates_item">
      <div class="participates_item_img" @click="$emit('show-photo', index)" @mouseenter="startRolling()" @mouseleave="stopRolling()">
        <div v-swiper:mySwiper="swiperOption" @click.stop>
          <div class="swiper-wrapper">
            <div class="swiper-slide" :key="i" v-for="(image, i) in item.images">
              <img :src="image.url" :alt="item.user.name + ' ' + item.user.last_name">
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
      </div>
      <div class="participates_item_header">
        <div class="like svg-path-color" :class="{hovered: activeLike == index}" @mouseover="$emit('mouse-over', index)" @mouseleave="$emit('active-like', -1)">
          <img svg-inline class="icon" src="@/assets/icons/like.svg" alt="example" />
          <p class="style_text">{{ item.likesCount ? item.likesCount.toString() : '0' }}</p>
          <div class="likes-tooltip" v-if="item.likesCount && index == activeLike">
            <div class="likes-tooltip-wrapper">
              <template v-for="(like, k) in item.user.likes">
                <img :key="k" v-if="k < 4" :src="like.avatar" :alt="like.name" />
              </template>
            </div>
            <a href="#" @click.prevent="$emit('show-pop-up', index)">... {{ item.likesCount > 4 ? $t('tooltips.likes.also') + ' ' + (item.likesCount - 4) : $t('tooltips.likes.more') }}</a>
          </div>
        </div>
        <div class="leader" v-if="found">
          <p class="style_text" v-t="'you-found'" />
        </div>
        <div class="leader" v-else-if="index.startsWith('leader')">
          <p class="style_text">{{ id == 0 ? $t('leader') : `${id + 1} ${$t('place')}` }}</p>
        </div>
        <div v-else-if="user && item.user.id === user.id" class="leader">
          <p class="style_text" v-t="'you'" />
        </div>
        <div v-else-if="user && item.user.likes.find(l => l.user_id == user.id)" class="leader">
          <p class="style_text" v-t="'your-choice'" />
        </div>
      </div>
      <div class="participates_item_name" @click="$emit('show-photo', index)">
        <p class="style_text">{{ item.user.name }} {{ item.user.last_name }}</p>
        <span class="style_text">{{ item.user.city }}</span>
        <a class="participates_item_share" @click.stop="$emit('set-active-clip', index)">
          <img svg-inline class="icon" src="@/assets/icons/share.svg" alt="example" />
        </a>
      </div>
      <div class="overlay-swiper" v-if="activePopUp === index" @click="$emit('active-pop-up', -1)">
        <div class="overlay-swiper-row">
          <div class="likes_popup" @click.stop>
            <a class="btn_exit" @click.stop="$emit('close-pop-up', index)">
              <img svg-inline class="icon svg-stroke-color" src="@/assets/icons/btn-exit.svg" alt="example" />
            </a>
            <div class="likes_popup_title">
              <p class="likes_popup_title_number">{{ item.likesCount }}</p>
              <p class="likes_popup_title_voted" v-t="'likes.voted'" />
              <p class="likes_popup_title_subtitle">{{ $i18n.locale === 'RU' ? concert.title : ($i18n.locale === 'EN' ? concert.title__en : '') }}</p>
            </div>
            <div class="likes_popup_wrapper" v-body-scroll-lock="$emit('active-pop-up', index)">
              <a class="likes_popup_wrapper_item" v-for="(like, i) in item.user.likes" :key="i">
                <div class="likes_popup_img" :style="{
                          backgroundImage: `url(${like.avatar})`
                         }"></div>
                <p>{{ like.name }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="btn_like" @click="likePlease()" v-if="!user || item.user.id != user.id" :class="{active: user && item.user.likes.find(i => i.user_id ? i.user_id == user.id : false) }">
        <img svg-inline class="icon svg-path-color" src="@/assets/icons/btn-like.svg" alt="example" />
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="participates_item_share-modal" v-if="index == activeClip" :key="0" @click="$emit('set-active-clip', false)">
        <div class="participates_item_share-modal_card" @click.stop>
          <div class="clip" v-clipboard:copy="href" v-clipboard:success="copied">
            <span class="clip-text">{{ href }}</span>
            <svg class="clip-button" aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" fill="gray"></path></svg>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['item', 'activeLike', 'activePhoto', 'activePopUp', 'activeClip', 'index', 'found'],

  components: {
    FancySwiper: () => import('@/components/default/FancySwiper')
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        effect: 'fade',
        speed: 1000,
        loop: true,
        fadeEffect: {
          crossFade: true
        }
      },

      rollInterval: null
    }
  },

  computed: {
    ...mapState(['user', 'concert']),

    id() {
      return Number(this.index.replace('leaders-', '').replace('firstConcerts-', '').replace('items-', '').replace('linkItem-'))
    },

    href() {
      return `${window.location.origin}?referrer=${this.item.userId}`
    }
  },

  methods: {
    ...mapActions(['like']),

    startRolling() {
      this.rollInterval = setInterval(() => {
        this.mySwiper.slideNext();
      }, 1000);
    },

    stopRolling() {
      clearInterval(this.rollInterval);
      this.rollInterval = null;
      this.mySwiper.slideTo(1);
    },

    copied() {
      this.$toasted.success(this.$t('copied'));
      this.$emit('set-active-clip', false);
    },

    likePlease() {
      if (this.user) this.like({userId: this.item.user.id, isLike: !this.item.user.likes.find(i => i.user_id ? i.user_id == this.user.id : false)})
      else this.$root.$emit('auth')
    }
  }
}

</script>
