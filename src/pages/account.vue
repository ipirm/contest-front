<template>
  <div class="account-page" v-if="user">
    <div class="user">
      <div class="user_profile">
        <a class="user_profile_picture">
          <img :src="user.avatar" class="user_profile_image" />
          <input type="file" name="file" ref="fileChanger" @change="onFileChange" v-show="false">
          <img
            svg-inline
            class="icon btn_avatar svg-path-color"
            src="@/assets/icons/btn-avatar.svg"
            :alt="`${user.name} ${user.last_name}`"
            @click="$refs.fileChanger.click()"
          />
        </a>
        <div class="user_profile_text">
          <p class="user_profile_text_name">{{ user.name }} {{ user.last_name }}</p>
          <p class="user_profile_text_city" v-if="user.age || user.city">{{ user.city +  ' • ' }}{{ user.age }} лет</p>
          <a class="user_profile_text_edit">
            <img
              svg-inline
              class="icon svg-path-color"
              src="@/assets/icons/edit.svg"
              alt="example"
            />
            <p>Редактировать</p>
          </a>
        </div>
      </div>
      <div class="user_statistics">
        <div class="user_statistics_wrapper">
          <div class="user_statistics_container">
            <p class="user_statistics_number">48</p>
            <p class="user_statistics_text">Учавствовал</p>
          </div>
          <div class="user_statistics_container">
            <p class="user_statistics_number">42</p>
            <p class="user_statistics_text">Победил</p>
          </div>
          <div class="user_statistics_container">
            <p class="user_statistics_number">48</p>
            <p class="user_statistics_text">Голосовал</p>
          </div>
        </div>
        <div class="user_statistics_dignity">
          <img
            svg-inline
            class="icon"
            src="@/assets/icons/pattern-left.svg"
            alt="example"
          />

          <div class="user_statistics_dignity_wrapper">
            <span> Больше всего голосов набрал в </span>
            <p>Мистер Вселенная 2019</p>
          </div>
          <img
            svg-inline
            class="icon"
            src="@/assets/icons/pattern-right.svg"
            alt="example"
          />
        </div>
      </div>
      <div class="user_balans">
        <p class="user_balans_text">Баланс</p>
        <p class="user_balans_maining">
          {{ user.balance }}
        </p>
        <a class="btn_style btn_add"><span> Пополнить </span> </a>
      </div>
    </div>
    <div class="contests">
      <div class="contests_title"><p>Конкурсы</p></div>
      <div class="contests_container">
        <a
          class="contest_item"
          v-for="i in 8"
          :key="i"
          :style="{
            backgroundImage:
              'url(' + require('@/static/images/pic1.png') + ')'
          }"
        >
          <div class="contest_item_review">
            <div class="contest_item_review_margin">
              <img
                svg-inline
                class="icon"
                src="@/assets/icons/review.svg"
                alt="example"
              />

              <span> 48 </span>
            </div>
            <div class="contest_item_review_margin">
              <img
                svg-inline
                class="icon"
                src="@/assets/icons/heart.svg"
                alt="example"
              />

              <span> 24 </span>
            </div>
          </div>
          <div class="contest_item_score-likes">
            <div class="score">
              <div class="number">5</div>
              <div class="text">Место</div>
            </div>
            <div class="likes">
              <img
                svg-inline
                class="icon"
                src="@/assets/icons/heart.svg"
                alt="example"
              />
              <div class="number">48</div>
            </div>
          </div>
          <div class="contest_item_title">
            <span class="contest_item_title_subtitle">
              Мисс Инстаграм 2020
            </span>
            <span class="contest_item_title_date"> 10.11.2020 </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  created() {
    if (!this.user)
      this.$router.push('/');
  },

  computed: {
    ...mapState(['user'])
  },

  methods: {
    ...mapActions(['uploadAvatar']),

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.uploadAvatar(file);
      }
    }
  }
};
</script>

<style></style>
