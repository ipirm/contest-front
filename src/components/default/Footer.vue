<template>
  <footer>
    <div class="footer_logo">
      <a class="header_logo_img">
        <img
          class="icon svg-path-color"
          src="/img/logo.png"
          alt="Miss instagram 2020"
        />
      </a>
    </div>
    <div class="footer_links">
      <router-link to="/">{{ $t('footer.index') }}</router-link>
      <router-link to="/about">{{ $t('footer.about') }}</router-link>
      <router-link to="/rules">{{ $t('footer.rules') }}</router-link>
    </div>
    <div class="footer_socials">
      <a>
        <img
          svg-inline
          class="icon svg-path-color"
          src="@/assets/icons/vk.svg"
          alt="vk"
        />
      </a>
      <a>
        <img
          svg-inline
          class="icon svg-path-color"
          src="@/assets/icons/facebook.svg"
          alt="facebook"
        />
      </a>
      <a>
        <img
          svg-inline
          class="icon svg-path-color"
          src="@/assets/icons/instagram.svg"
          alt="instagram"
        />
      </a>
    </div>
  </footer>
</template>
