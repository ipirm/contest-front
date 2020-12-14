<template>
  <div class="contest">
    <div class="contest-page" @click="activeSort = false" v-if="concert">
      <div class="description">
        <div class="description_text">
          <div class="description_text_subtitle style_title">
            <h1 v-show="false">
              {{ $i18n.locale === 'RU' ? concert.title : ($i18n.locale === 'EN' ? concert.title__en : '') }}
            </h1>
            <img svg-inline class="icon svg-stroke-color svg-title" src="@/assets/icons/title.svg" :alt="$i18n.locale === 'RU' ? concert.title : ($i18n.locale === 'EN' ? concert.title__en : '')" v-if="$i18n.locale === 'RU'" />
            <img svg-inline class="icon svg-stroke-color svg-title" src="@/assets/icons/title-en.svg" :alt="$i18n.locale === 'RU' ? concert.title : ($i18n.locale === 'EN' ? concert.title__en : '')" v-else-if="$i18n.locale === 'EN'" />
            <span @click="toggleAccordion" class="accordion-toggler-wrapper" :class="{active: isTextShown}">
              <img svg-inline class="icon svg-stroke-color accordion-toggler" src="@/assets/icons/arrow-bottom.svg" alt="dropdown" />
            </span>
          </div>
          <div class="description_text_date style_text">
            <p>{{ $t('description.starts') }} {{ moment(concert.startDate, 'DD.MM.YYYY').format('DD MMMM YYYY') + ($i18n.locale === 'EN' ? '' : 'г') }} {{ $t('description.to') }} {{ moment(concert.endDate, 'DD.MM.YYYY').format('DD MMMM YYYY') + ($i18n.locale === 'EN' ? '' : 'г') }}</p>
          </div>
          <p class="description_text_main-text style_text" ref="descriptionText" :class="{active: isTextShown}">
            {{ $i18n.locale === 'RU' ? concert.description : ($i18n.locale === 'EN' ? concert.description__en : '') }}
          </p>
          <div class="btn_style btn_contest_participate" v-if="user && user.concertsUsers && !user.concertsUsers.length || !user" @click="activeLoad = true" v-t="'description.participate'" />
        </div>
        <div class="description_days">
          <div>
            <countdown :time="Math.max(startDateTimestamp - moment().unix() * 1000, 0)" :transform="transform" class="description_days_title style_title">
              <template slot-scope="props">
                {{ props.days }}{{ $t('timer.d') }} : {{ props.hours }}{{ $t('timer.h') }} : {{ props.minutes }}{{ $t('timer.m') }}
                : {{ props.seconds }}{{ $t('timer.s') }}
              </template>
            </countdown>
            <p class="description_days_to-end style_text" v-t="'description.to-end'" />
          </div>
          <div class="description_prizes">
            <span class="title" v-t="'description.prizes-title'" />
            <div class="prizes">
              <div class="prize" v-for="(place, i) in concert.places" :key="i">
                <div class="cost">{{ place.total }}%</div>
                <div class="place">{{ i+1 }} {{ $i18n.locale === 'RU' ? place.name : ($i18n.locale === 'EN' ? place.name__en : '') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="overlay-swiper participate-slider" v-if="activeLoad" v-body-scroll-lock="activeLoad">
        <div class="overlay-swiper__bg" @click="activeLoad = false"></div>
        <div class="overlay-swiper-row">
          <div class="participate_popup">
            <a class="btn-exit-aligne" @click="activeLoad = false">
              <img svg-inline class="icon svg-stroke-color" src="@/assets/icons/btn-exit.svg" alt="example" />
            </a>
            <div class="participate_popup_title">
              <span class="participate_popup_text-style" v-t="'participate.upload'" />
              <p>{{ $i18n.locale === 'RU' ? concert.title : ($i18n.locale === 'EN' ? concert.title__en : '') }}</p>
            </div>
            <div class="participate_popup_upload">
              <div class="participate_popup_upload_container">
                <a class="btn-upload btn_style">
                  <input placeholder="Загрузить файлы" type="file" name="file" id="file" @change="onFileChange" class="inputStyle" />
                  <label for="file" v-t="'participate.upload-file'" />
                </a>
                <p v-t="'participate.max-size'" />
              </div>
            </div>
            <div v-swiper:mySwiper2="swiperOption" class="participate_popup_photo">
              <div class="swiper-wrapper">
                <template v-for="(item, i) in files">
                  <div class="swiper-slide participate_popup_photo_item" :key="i">
                    <img :src="item.url" />
                    <div class="popup_photo_item_close" @click="removeFile(i)">
                      <img svg-inline class="icon upload_exit" src="@/assets/icons/btn-exit.svg" alt="example" />
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="participate_popup_footer">
              <div class="btn_participate btn_style popup_btn-style" @click="onParticipate()" v-if="user">
                <span v-t="'participate.participate'" />
              </div>
              <div class="btn_participate btn_style popup_btn-style" v-else @click="toAuth()">
                <span v-t="'participate.auth'" />
              </div>
              <p v-t="'participate.cost'" />
              <span class="participate_popup_text-style"> $10 </span>
            </div>
          </div>
        </div>
      </div>
      <div class="participates">
        <div class="participates_util">
          <div class="participates_util_wrapper">
            <p class="participates_util_title style_text" v-t="'participants.participants'" />
            <div class="description_text_stata style_text">
              <div class="description_text_stata_column" v-if="participants">
                <span> {{ participants.participations }} </span>
                <p v-t="'participants.total-participants'" />
              </div>
              <div class="description_text_stata_column" v-if="participants">
                <span> {{ participants.likes }} </span>
                <p v-t="'participants.voted'" />
              </div>
            </div>
          </div>
          <div :class="[
              'participates_util_order',
              'style_text',
              { order_active: activeSort }
            ]" @click.stop="activeSort = !activeSort">
            <div class="participates_util_order_wrapper">
              <p class="active-selected" v-t="activeSelected === this.$t('sorting.show-all') ? this.$t('sorting.placeholder') : activeSelected" />
              <img svg-inline class="icon svg-stroke-color" src="@/assets/icons/arrow-bottom.svg" alt="example" />
            </div>
            <div class="participates_util_options">
              <template v-for="(item, i) in sortItems">
                <p v-if="item !== activeSelected" @click="selectItem(item)" :key="i">
                  {{ item }}
                </p>
              </template>
            </div>
          </div>
        </div>
        <div class="participate_wrapper" v-if="participants" :class="{all: loadedAllParticipants}">
          <div class="participate_wrapper_overlay" v-if="participants.linkItem">
            <ParticipantInner :item="participants.linkItem" :found="true" :index="`linkItem-1-${searchNumber}`" :activeLike="activeLike" :activePhoto="activePhoto" @active-pop-up="activePopUp = $event" @set-active-sort="activeSort = $event" @close-popup-parent="closePopupParent()" @mouse-over="mouseOver($event)" @show-pop-up="showPopUp($event)" @show-photo="activePhoto = $event" @close-pop-up="closePopUp($event)" @active-like="activeLike = $event" @set-active-clip="activeClip = $event" :activeClip="activeClip" :activePopUp="activePopUp" />
          </div>
          <template v-if="participants.firstConcerts">
            <div class="participate_wrapper_overlay" v-for="(item, i) in participants.firstConcerts" :key="`firstConcerts-${i}-${searchNumber}`">
              <ParticipantInner :item="item" :index="`firstConcerts-${i}-${searchNumber}`" :activeLike="activeLike" :activePhoto="activePhoto" @active-pop-up="activePopUp = $event" @set-active-sort="activeSort = $event" @close-popup-parent="closePopupParent()" @mouse-over="mouseOver($event)" @show-pop-up="showPopUp($event)" @show-photo="activePhoto = $event" @close-pop-up="closePopUp($event)" @active-like="activeLike = $event" @set-active-clip="activeClip = $event" :activeClip="activeClip" :activePopUp="activePopUp" />
            </div>
          </template>
          <template v-if="participants.leaders">
            <div class="participate_wrapper_overlay" v-for="(item, i) in participants.leaders" :key="`leaders-${i}-${searchNumber}`">
              <ParticipantInner :item="item" :index="`leaders-${i}-${searchNumber}`" :id="i" :activeLike="activeLike" :activePhoto="activePhoto" @active-pop-up="activePopUp = $event" @set-active-sort="activeSort = $event" @close-popup-parent="closePopupParent()" @mouse-over="mouseOver($event)" @show-pop-up="showPopUp($event)" @show-photo="activePhoto = $event" @close-pop-up="closePopUp($event)" @active-like="activeLike = $event" @set-active-clip="activeClip = $event" :activeClip="activeClip" :activePopUp="activePopUp" />
            </div>
          </template>
          <template v-if="participants.items">
            <div class="participate_wrapper_overlay" v-for="(item, i) in participants.items" :key="`items-${i}-${searchNumber}`">
              <ParticipantInner :item="item" :index="`items-${i}-${searchNumber}`" :activeLike="activeLike" :activePhoto="activePhoto" @active-pop-up="activePopUp = $event" @set-active-sort="activeSort = $event" @close-popup-parent="closePopupParent()" @mouse-over="mouseOver($event)" @show-pop-up="showPopUp($event)" @show-photo="activePhoto = $event" @close-pop-up="closePopUp($event)" @active-like="activeLike = $event" @set-active-clip="activeClip = $event" :activeClip="activeClip" :activePopUp="activePopUp" />
            </div>
          </template>
        </div>
        <div class="no-results" v-t="'no-results'" v-if="searchQuery.length && participants && participants.meta && !participants.meta.totalItems && !participants.meta.itemCount" />
        <div class="no-results" v-t="'no-liked'" v-if="activeSelected === $t('sorting.user-likes') && participants && participants.meta && !participants.meta.totalItems && !participants.meta.itemCount" />
        <infinite-loading @infinite="infiniteHandler" :key="infinityKey" :distance="infinityDistance">
          <div slot="no-results" />
          <div slot="no-more" />
          <div slot="spinner">
            <img svg-inline class="icon svg-stroke-color" src="@/assets/icons/spinner.svg" alt="loading" />
          </div>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    InfiniteLoading: () => import('vue-infinite-loading'),
    ParticipantInner: () => import('@/components/ParticipantInner')
  },

  data() {
    return {
      infinityDistance: 100,
      infinityKey: 1,
      loadedAllParticipants: false,

      activePopUp: false,
      activeLike: false,
      activePhoto: false,
      activeClip: false,

      isTextShown: false,

      activeSort: false,
      activeLoad: false,
      activeSelected: this.$t('sorting.show-all'),
      sortItems: [
        this.$t('sorting.by-likes'),
        this.$t('sorting.by-created-date'),
        this.$t('sorting.show-all'),
        this.$t('sorting.user-likes'),
        this.$t('sorting.random')
      ],
      files: [],
      swiperOption: {
        centeredSlides: false,
        slidesPerView: 2,
        spaceBetween: 5,
        observer: true,
        observeParents: true,
        breakpoints: {
          // when window width is >= 320px
          500: {
            centeredSlides: false,
            slidesPerView: 3,
            spaceBetween: 5
          }
        }
      }
    };
  },

  created() {
    this.getConcert();

    if (!this.participants) {
      if (this.$route.query.referrer) {
        this.getParticipantsByLinkID(this.$route.query.referrer);
      } else
        this.getParticipants();
    }

    window.addEventListener('resize', this.onResize, false);
    this.onResize();
  },

  computed: {
    ...mapState(['user', 'concert', 'participants', 'searchQuery', 'searchNumber']),

    moment() {
      return moment
    },

    startDateTimestamp() {
      const date = this.concert.startDate.split('.');
      return (new Date(date[2], date[1] - 1, date[0])).getTime();
    },
  },

  watch: {
    concert() {
      this.$nextTick(() => {
        this.onResize();
      });
    }
  },

  methods: {
    ...mapActions(['participate', 'getConcert', 'getParticipants', 'getMoreParticipants', 'search', 'getParticipantsByLinkID']),
    ...mapMutations(['increasePage']),

    toAuth() {
      this.$root.$emit('auth');
      this.activeLoad = false;
    },

    toggleAccordion() {
      if (this.isTextShown) {
        this.isTextShown = false;
        this.$refs.descriptionText.style.height = 0;
      } else {
        this.isTextShown = true;
        this.$refs.descriptionText.style.height = this.$refs.descriptionText.scrollHeight + 'px';
      }
    },

    closePopupParent() {
      this.activePhoto = -1;
    },
    mouseOver(i) {
      this.activeLike = i;
    },
    showPopUp(i) {
      this.activeSort = false;
      this.activePopUp = i;
    },
    closePopUp() {
      this.activePopUp = -1;
      this.activeLike = -1;
    },

    infiniteHandler($state) {
      if (this.participants) {
        if (this.participants.items.length < parseInt(this.participants.meta.totalItems)) {
          this.increasePage();
          let query;
          if (this.activeSelected == this.$t('sorting.by-likes')) query = 'likes'
          else if (this.activeSelected == this.$t('sorting.by-created-date')) query = 'date'
          else if (this.activeSelected == this.$t('sorting.user-likes')) query = 'user_likes'
          else query = null;
          if (this.searchQuery == '') {
            this.getMoreParticipants(query).then(() => {
              $state.loaded();
            })
          } else this.search({ searchString: this.searchQuery, query });
        } else {
          $state.complete()
          this.loadedAllParticipants = true;
        }
      } else {
        setTimeout(() => {
          $state.loaded();
        }, 5000);
      }
    },

    async onParticipate() {
      if (!this.user) {
        this.$toasted.error('Пожалуйста авторизуйтесь');
        return;
      }

      if (this.files.length) {
        await this.participate(this.files).then(() => {
          this.activeLoad = false;
        });
      } else {
        this.$toasted.error('Укажите минимум 1 фото');
      }
    },

    removeFile(i) {
      this.files = this.files.filter((item, index) => index !== i);
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.files.push({
          url: URL.createObjectURL(file),
          file
        });
      }
    },
    selectItem(item) {
      this.activeSelected = item;
      let query;
      if (item == this.$t('sorting.by-likes')) query = 'likes'
      else if (item == this.$t('sorting.by-created-date')) query = 'date'
      else if (item == this.$t('sorting.user-likes')) query = 'user_likes'
      else if (item == this.$t('sorting.random')) query = 'random'
      else query = null;
      if (!query) this.activeSelected = this.$t('sorting.show-all');
      if (this.searchQuery == '') {
        this.getParticipants(query);
      } else this.search({ searchString: this.searchQuery, query });
    },
    showPhoto(i) {
      this.activePopUp = -1;
      this.activeLike = -1;
      this.activePhoto = i;
    },
    transform(props) {
      Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
        const digits = value < 10 ? `0${value}` : value;

        // uses singular form when the value is less than 2
        // const word = value < 2 ? key.replace(/s$/, "") : key;

        props[key] = `${digits}`;
      });

      return props;
    },

    onResize() {
      if (!this.$refs.descriptionText) {
        return;
      }

      this.isTextShown = false;
      if (window.innerWidth <= 540)
        this.$refs.descriptionText.style.height = 0;
      else this.$refs.descriptionText.style.height = '';
    }
  }
};

</script>
<style></style>
