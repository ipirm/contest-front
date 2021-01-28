<template>
  <transition mode="out-in" name="fade">
    <div class="accept-rules-modal" v-if="show">
      <div class="accept-rules-modal__bg"></div>
      <div class="accept-rules-modal__card">
        <div class="checkbox-wrapper" @click="onCheckClick">
          <span class="checkbox" :class="{active: accepted}"></span>
          <span class="text" v-t="'accept-rules-modal.accept'" />
          <a target="_blank" href="/rules" @click.stop class="text" v-t="'accept-rules-modal.rules'" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: "AcceptRulesModal",

  props: ['user'],

  data() {
    return {
      show: false,
      accepted: false
    }
  },

  watch: {
    user: {
      deep: true,
      immediate: true,
      handler() {
        if (this.user && !this.user.accept_rules) {
          this.show = true;
        } else this.show = false;
      }
    }
  },

  methods: {
    ...mapActions(['acceptRules']),

    onCheckClick() {
      this.accepted = true;
      this.acceptRules().then(() => {
        this.show = false;
      }).catch(() => {
        this.accepted = false;
      })
    }
  }
}
</script>

<style lang="scss">
.accept-rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999999;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
  }

  &__card {
    border-radius: 10px;
    min-height: 100px;
    min-width: 320px;
    background: #fff;
    padding: 30px;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>