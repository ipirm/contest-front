import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import SvgSprite from 'vue-svg-sprite';
import BodyScrollLockDirective from 'v-body-scroll-lock';
import { Swiper, EffectFade, Pagination } from 'swiper';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import i18n from './locales'
import lsService from './services/lsService'
import VueClipboard from 'vue-clipboard2'

import VueCountdown from '@chenfengyuan/vue-countdown';
import 'swiper/swiper-bundle.css'
import vClickOutside from 'v-click-outside'
import Toasted from 'vue-toasted';
import VueLazyload from 'vue-lazyload'
 
i18n.locale = lsService.getLocale();

require('moment/locale/ru');

Vue.use(VueClipboard);
Vue.use(VueLazyload)
Vue.component(VueCountdown.name, VueCountdown);
Swiper.use([EffectFade, Pagination]);
Vue.use(VueAwesomeSwiper, /* { default options with global component } */)
Vue.use(vClickOutside)
Vue.use(SvgSprite);
Vue.config.productionTip = false
Vue.use(BodyScrollLockDirective);
Vue.use(Toasted, {
	position: 'top-center',
	duration: 5000
})

new Vue({
	i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
