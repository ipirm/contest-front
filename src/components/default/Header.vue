<template>
  <header>
    <div class="header_logo">
      <router-link class="header_logo_img" to="/">
        <!-- <img src="">  -->
        Лого
      </router-link>
    </div>
    <div class="header_main">
      <div class="header_main_line" />
      <a @click.prevent="goToLink('/')" href="/" :class="{header_main_active: $route.path == '/'}"><span>Главная</span></a>
      <a @click.prevent="goToLink('/about')" href="/about" :class="{header_main_active: $route.path == '/about'}"><span>О нас</span></a>
      <a @click.prevent="goToLink('/rules')" href="/rules" :class="{header_main_active: $route.path == '/rules'}"><span>Правила</span></a>
    </div>
    <div class="header_util">
      <div class="header_util_container header_search desktop" :class="{'no-auth': isLoggedIn, active: searchInput || isSearchActive}" @click="isSearchActive = true" v-click-outside="() => {isSearchActive = false}">
        <div class="header_search_inner">
          <img
            svg-inline
            class="icon header_util_img svg-stroke-color"
            src="@/assets/icons/search.svg"
            alt="example"
            @click="isSearchActive ? searchStuff() : isSearchActive = true"
          />
          <input class="header_util_style header_search_input" v-model="searchInput" :class="{active: searchInput || isSearchActive}" placeholder="Поиск" @keydown.enter="searchStuff()" @input="searchStuff()">
        </div>
      </div>
      <div class="header_util_container header_util_style header_login_container">
        <template v-if="isLoggedIn">
          <router-link to="/account" class="header_login_wrapper desktop">
            <img :src="user.avatar" />
            <div class="header_login">
              <span> {{ user.name }} </span>
              <p>
                {{ user.balance }}
              </p>
            </div>
          </router-link>
          <div class="dropdown-icon_wrapper" @click="isDropdownOpen = !isDropdownOpen">
            <img
              svg-inline
              class="icon dropdown-icon"
              src="@/assets/icons/btm-black.svg"
              alt="example"
            />
          </div>
          <div class="dropdown" v-if="isDropdownOpen" v-click-outside="() => {isDropdownOpen = false}">
            <ul>
              <li>
                <router-link to="/account"><span>Аккаунт</span></router-link>
              </li>
              <li @click="logout"><span>Выйти</span></li>
            </ul>
          </div>
        </template>
        <div class="header_util_style header_login-button desktop" v-else>
          <span @click="isLoginModalOpen = true">Войти</span>
        </div>

        <button class="hamburger hamburger--spin header_menu-button" @click="toggleMenu()" :class="{ 'is-active': isMenuActive }">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
        <div class="header_menu_wrapper" :class="{active: isMenuActive}">
          <div class="full-bg" @click="onBgClick()" :class="{active: isMenuActive}"></div>
          <div class="header_menu_slider">
            <div class="header_menu">
              <ul class="header_menu_list">
                <li>
                  <a @click.prevent="goToLink('/')" href="/" :class="{header_main_active: $route.path == '/'}">Главная</a>
                </li>
                <li>
                  <a @click.prevent="goToLink('/about')" href="/about" :class="{header_main_active: $route.path == '/about'}">О нас</a>
                </li>
                <li>
                  <a @click.prevent="goToLink('/rules')" href="/rules" :class="{header_main_active: $route.path == '/rules'}">Правила</a>
                </li>
              </ul>
              <div class="header_menu_footer">
                <div class="header_menu_account-lang">
                  <a class="header_util_container header_lang" @click="changeLang()">
                    <img
                      svg-inline
                      class="icon header_util_rus no-ml"
                      :src="`/svg/${locale}.svg`"
                      alt="example"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a class="header_util_container header_lang desktop" @click="changeLang()">
        <img
          svg-inline
          class="icon header_util_rus"
          :src="`/svg/${locale}.svg`"
          alt="example"
        />

        <!-- <img
          svg-inline
          class="icon"
          src="@/assets/icons/btm-black.svg"
          alt="example"
        /> -->
      </a>
    </div>

    <transition name="fade" mode="out-in">
      <div class="login-modal" v-if="isLoginModalOpen" v-bsl="isLoginModalOpen" :key="1" @click="isLoginModalOpen = false">
        <div class="login-modal__card" @click.stop>
          <button class="login-modal__close-button" @click="isLoginModalOpen = false"></button>
          <h2 class="login-modal__title">Войти</h2>
          <div class="login-modal__social-buttons">
            <a class="link" :href="`${apiUrl}/api/auth/vkontakte`">
              <img
                svg-inline
                class="icon svg-path-color"
                src="@/assets/icons/vk.svg"
                alt="example"
              />
            </a>
            <a class="link" :href="`${apiUrl}/api/auth/google`">
              <img
                svg-inline
                class="icon svg-path-color"
                src="@/assets/icons/google.svg"
                alt="example"
              />
            </a>
            <a class="link" :href="`${apiUrl}/api/auth/facebook`">
              <img
                svg-inline
                class="icon svg-path-color"
                src="@/assets/icons/facebook.svg"
                alt="example"
              />
            </a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
<script>
import {debounce} from '@/utils/debounce'
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  name: "Header",

  data () {
    return {
      isSearchActive: false,
      searchInput: '',
      isDropdownOpen: false,
      isMenuActive: false,
      isLoginModalOpen: false
    }
  },

  mounted() {
    this.$root.$on('auth', () => {
      this.isLoginModalOpen = true;
    })

    window.addEventListener('resize', this.setLinePosition, false);
    this.setLinePosition();
  },

  computed: {
    ...mapState(['user', 'locale']),

    isLoggedIn() {
      return this.user ? true : false;
    },

    apiUrl() {
      return process.env.VUE_APP_API_URL;
    }
  },

  methods: {
    ...mapMutations(['removeUser', 'setLocale', 'setPage', 'setSearchLoading']),
    ...mapActions(['getParticipants', 'search']),

    setLinePosition() {
      // set the bottom line
      const wrapper = this.$el.querySelector('.header_main'),
        line = this.$el.querySelector('.header_main_line'),
        links = this.$el.querySelectorAll('.header_main .header_main_active');

      const currentLink = links ? Array.from(links).find(l => l.pathname === this.$route.path) : null;

      if (currentLink) {
        const currentLinkRect = currentLink.getBoundingClientRect();
        line.style.width = `${currentLinkRect.width}px`;
        line.style.transform = `translateX(${currentLinkRect.left - wrapper.getBoundingClientRect().left}px)`;
      }
    },

    searchStuff() {
      this.setSearchLoading(true);

      if (this.$route.path != '/') 
        this.$router.push('/').catch(() => {});

      this.$nextTick(() => {
        debounce(async () => {
          this.setPage(0);
          this.search({ searchString: this.searchInput.replace(' ', '') });
        }, 250)();
      });
    },

    changeLang() {
      if (this.$i18n.locale == 'RU') this.setLocale('EN');
      else if (this.$i18n.locale == 'EN') this.setLocale('RU');
    },

    goToLink(link) {
      this.isMenuActive = false;
      this.$router.push('/').catch(() => {});
      this.$router.push(link).catch(() => {});
      this.$nextTick(() => {
        setTimeout(() => {
          this.setLinePosition();
        }, 500);
      });
    },

    logout() {
      localStorage.removeItem('auth_token');
      this.removeUser();
      this.getParticipants();
      this.$router.push('/');
    },

    toggleMenu() {
      if(this.isMenuActive)
        this.closeMenu();
      else this.openMenu();
    },

    openMenu() {
      this.isMenuActive = true;
    },

    closeMenu() {
      this.isMenuActive = false;
    },

    onBgClick() {
      this.closeMenu();
    }
  }
};
</script>
