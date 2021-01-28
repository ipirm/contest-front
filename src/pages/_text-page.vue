<template>
  <div>
    <transition name="fade" mode="out-in">
      <div v-if="isPageShown" :key="1">
        <div class="text-page">
          <div class="text-page_title">
            <h1>{{ h1 }}</h1>
          </div>
          <div v-html="content" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {

  name: 'TextPage',

  data() {
    return {
      isPageShown: true
    }
  },

  watch: {
    '$route.params.name'() {
      this.isPageShown = false;

      setTimeout(() => {
        this.isPageShown = true;
      }, 500);
    }
  },

  computed: {
    h1() {
      if (this.$route.params.name === 'rules') return this.$t('text-page.rules');
      else if (this.$route.params.name === 'about') return this.$t('text-page.about');
      return '';
    },

    content() {
      if (this.$route.params.name === 'rules') return this.$t('text-page.rules-content');
      else if (this.$route.params.name === 'about') return this.$t('text-page.about-content');
      return '';
    }
  }
};
</script>
