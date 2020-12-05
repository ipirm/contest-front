<template>
  <div>
    <FancySwiper v-body-scroll-lock="activePhoto !== -1" v-if="activePhoto === index" @closePopup="$emit('close-popup-parent')" :banners="item.images" />
    <div class="participates_item">
      <div class="participates_item_img" @click="$emit('show-photo', index)">
        <img v-lazy="item.images[0].url" :alt="item.user.name + ' ' + item.user.last_name">
      </div>
      <div class="participates_item_header">
        <div class="like svg-path-color" :class="{hovered: activeLike == index}" @mouseover="$emit('mouse-over', index)" @mouseleave="$emit('active-like', -1)">
          <img svg-inline class="icon" src="@/assets/icons/like.svg" alt="example" />
          <p class="style_text">{{ item.likesCount.toString() }}</p>
          <div class="likes-tooltip" v-if="item.likesCount && index == activeLike">
            <div class="likes-tooltip-wrapper">
              <template v-for="(like, k) in item.user.likes">
                <img :key="k" v-if="k < 4" :src="like.avatar" :alt="like.name" />
              </template>
            </div>
            <a href="#" @click.prevent="$emit('show-pop-up', index)">... {{ item.likesCount > 4 ? $t('tooltips.likes.also') + ' ' + (item.likesCount - 4) : $t('tooltips.likes.more') }}</a>
          </div>
        </div>
        <div class="leader" v-if="index.startsWith('leader')">
          <p class="style_text">{{ id == 0 ? $t('leader') : `${id + 1} ${$t('place')}` }}</p>
        </div>
        <div v-if="user && item.user.id === user.id" class="leader">
          <p class="style_text" v-t="'you'" />
        </div>
      </div>
      <div class="participates_item_name" @click="$emit('show-photo', index)">
        <p class="style_text">{{ item.user.name }} {{ item.user.last_name }}</p>
        <span class="style_text">{{ item.user.city }}</span>
        <a class="participates_item_share">
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
      <div class="btn_like" @click="like({userId: item.user.id, isLike: user && !item.user.likes.find(i => i.user_id ? i.user_id == user.id : false)})" v-if="!user || item.user.id != user.id" :class="{active: user && item.user.likes.find(i => i.user_id ? i.user_id == user.id : false) }">
        <img svg-inline class="icon svg-path-color" src="@/assets/icons/btn-like.svg" alt="example" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: ['item', 'activeLike', 'activePhoto', 'activePopUp', 'index'],

  components: {
    FancySwiper: () => import('@/components/default/FancySwiper')
  },

  computed: {
    ...mapState(['user', 'concert']),

    id() {
      return Number(this.index.replace('leaders-', '').replace('firstConcerts-', '').replace('items-', ''))
    }
  },

  methods: {
    ...mapActions(['like'])
  }
}

</script>
