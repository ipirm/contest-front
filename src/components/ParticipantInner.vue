<template>
  <div class="participant-inner">
    <FancySwiper v-body-scroll-lock="activePhoto !== -1" v-if="activePhoto === index" @closePopup="$emit('close-popup-parent')" :banners="item.images" />
    <div class="participates_item">
      <div class="participates_item_img" @click="$emit('show-photo', index)" @mouseenter="startRolling()" @mouseleave="stopRolling()">
        <div v-swiper:mySwiper="swiperOption">
          <div class="swiper-wrapper">
            <div class="swiper-slide" :key="`${index}-${i}`" v-for="(image, i) in item.images">
              <img class="swiper-lazy" :src="image.url" :alt="item.user.name + ' ' + item.user.last_name">
            </div>
          </div>
        </div>
      </div>
      <div class="participates_item_header">
        <div class="like svg-path-color" :class="{hovered: activeLike == index}" @mouseover="$emit('mouse-over', index)" @mouseleave="$emit('active-like', -1)">
          <img svg-inline class="icon" src="@/assets/icons/like.svg" alt="example" />
          <p class="style_text">{{ (item.likesCount + (liked ? 1 : 0)).toString() }}</p>
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
          <img svg-inline class="icon" src="@/assets/icons/crown.svg" alt="crown" v-if="id == 0" />
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
        <div :class="`swiper-pagination-${index}`" v-if="item.images.length > 1"></div>
        <a class="participates_item_share" @click.stop="$emit('set-active-clip', index)">
          <img svg-inline class="icon" src="@/assets/icons/share.svg" alt="example" />
        </a>
      </div>
      <div class="overlay-swiper" v-if="activePopUp === index">
        <div class="overlay-swiper__bg" @click="$emit('active-pop-up', -1)"></div>
        <div class="overlay-swiper-row">
          <div class="likes_popup">
            <a class="btn_exit" @click.stop="$emit('close-pop-up', index)">
              <img svg-inline class="icon svg-stroke-color" src="@/assets/icons/btn-exit.svg" alt="example" />
            </a>
            <div class="likes_popup_title">
              <p class="likes_popup_title_number">{{ (item.likesCount + (liked ? 1 : 0)).toString() }}</p>
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
      <div class="btn_like" @click="likeThis" v-if="!user || item.user.id != user.id" :class="{active: liked }">
        <img svg-inline class="icon svg-path-color" src="@/assets/icons/btn-like.svg" alt="example" />
      </div>
    </div>

    <transition name="fade" mode="out-in">
      <div class="participates_item_share-modal" v-body-scroll-lock="index == activeClip" v-if="index == activeClip" :key="0" @click="$emit('set-active-clip', false)">
        <div class="participates_item_share-modal_card" @click.stop>
          <div class="btn_exit" @click="$emit('set-active-clip', false)">
            <img svg-inline class="icon svg-stroke-color" src="@/assets/icons/btn-exit.svg" alt="example" />
          </div>
          <h2 class="participates_item_share-modal_title" v-t="'share-modal.title'" />
          <div class="clip" v-clipboard:copy="href" v-clipboard:success="copied">
            <span class="clip-text">{{ href }}</span>
            <svg class="clip-button" aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z" fill="gray"></path></svg>
          </div>
          <div class="login-modal__social-buttons social-buttons">
            <facebook :url="href" scale="1.5" class="social-button" />
            <twitter :url="href" scale="1.5" class="social-button" />
            <reddit :url="href" scale="1.5" class="social-button" />
            <telegram :url="href" scale="1.5" class="social-button" />
            <whats-app :url="href" scale="1.5" class="social-button" />
            <pinterest :url="href" scale="1.5" class="social-button" />
            <a class="social-button vk" target="_blank" :href="`https://vk.com/share.php?url=${href}`">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 14.171 14.171" style="enable-background:new 0 0 14.171 14.171;" xml:space="preserve">
                <path style="fill:#4D76A1;" d="M13.268,0H0.905C0.405,0,0,0.405,0,0.904v12.363c0,0.499,0.405,0.904,0.905,0.904h12.362
                  c0.499,0,0.904-0.405,0.904-0.904V0.904C14.172,0.404,13.767,0,13.268,0z M11.755,8.635c0.259,0.264,0.821,0.707,0.719,1.158
                  c-0.094,0.414-0.712,0.263-1.312,0.287c-0.685,0.029-1.091,0.044-1.503-0.287C9.465,9.636,9.351,9.45,9.165,9.242
                  C8.996,9.054,8.783,8.717,8.493,8.73C7.972,8.756,8.135,9.482,7.95,9.977c-2.896,0.456-4.059-1.333-5.085-3.069
                  C2.368,6.067,1.65,4.261,1.65,4.261l2.048-0.007c0,0,0.657,1.195,0.831,1.503c0.148,0.262,0.311,0.47,0.479,0.704
                  c0.141,0.194,0.364,0.574,0.608,0.543c0.397-0.051,0.469-1.591,0.223-2.107C5.741,4.688,5.506,4.615,5.263,4.544
                  C5.345,4.026,7.56,3.918,7.918,4.32c0.52,0.584-0.36,2.21,0.352,2.684c1-0.524,1.854-2.718,1.854-2.718l2.398,0.015
                  c0,0-0.375,1.186-0.768,1.712c-0.229,0.308-0.989,0.994-0.959,1.503C10.819,7.919,11.437,8.311,11.755,8.635z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {debounce} from '@/utils/debounce'
import { mapState, mapActions, mapMutations } from 'vuex'
import { Facebook, Twitter, Reddit, Telegram, WhatsApp, Pinterest } from 'vue-socialmedia-share';

export default {
  props: ['item', 'activeLike', 'activePhoto', 'activePopUp', 'activeClip', 'index', 'found', 'id'],

  components: {
    FancySwiper: () => import('@/components/default/FancySwiper'),
    Facebook,
    Twitter,
    Reddit,
    Telegram,
    WhatsApp,
    Pinterest
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        effect: 'fade',
        speed: 950,
        loop: true,
        fadeEffect: {
          crossFade: true
        },
        pagination: {
          el: `.swiper-pagination-${this.index}`,
          type: 'bullets'
        },
        lazy: {
          loadPrevNext: true
        }
      },

      liked: false,
      firstTime: true,
      rollInterval: null
    }
  },

  created() {
    // checking if the current user has liked the participant
    // if liked
    console.log(this.item.user.likes.findIndex(p => p.user_id == this.user.id) !== -1)
    if (this.item.user.likes.findIndex(p => p.user_id == this.user.id) !== -1) {
      this.reduceLikedBy1({id: this.item.userId, type: this.index.split('-')[0]});
      this.liked = true;
    }
  },

  computed: {
    ...mapState(['user', 'concert']),

    href() {
      return `${window.location.origin}?referrer=${this.item.userId}`
    }
  },

  methods: {
    ...mapActions(['like']),
    ...mapMutations(['reduceLikedBy1']),

    startRolling() {
      if (window.innerWidth > 540 && this.item.images.length > 1) {
        this.rollInterval = setInterval(() => {
          if (this.mySwiper && this.mySwiper.params)
            this.mySwiper.slideNext();
        }, 1000);
      }
    },

    stopRolling() {
      clearInterval(this.rollInterval);
      this.rollInterval = null;
      if (this.mySwiper && this.mySwiper.params)
        this.mySwiper.slideTo(1);
    },

    copied() {
      this.$toasted.success(this.$t('copied'));
      this.$emit('set-active-clip', false);
    },

    likeThis() {
      if (this.user) {
        this.liked = !this.liked;
        this.likePlease();
      } else {
        this.$root.$emit('auth')
      }
    },

    likePlease: debounce(function() {
      this.like({participantId: this.item.userId, isLike: this.liked})
    }, 500)
  }
}

</script>
