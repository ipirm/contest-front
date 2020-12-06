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
          <p class="user_profile_text_name" v-if="!editingName">{{ user.name }} {{ user.last_name }}</p>
          <div class="user_profile_name_input" v-else>
            <input type="text" v-model="name" :placeholder="$t('name')">
            <input type="text" v-model="last_name" :placeholder="$t('surname')">
            <input type="text" v-model="city" :placeholder="$t('city')">
            <input type="number" v-model="age" :placeholder="$t('age')">
          </div>
          <p class="user_profile_text_city" v-if="!editingName && (user.age || user.city)">{{ user.city }}<template v-if="user.age && user.city"> • </template><template v-if="user.age">{{ user.age }} лет</template></p>
          <div class="user_profile_text_edit" @click="editingName = true" v-if="!editingName">
            <img
              svg-inline
              class="icon svg-path-color"
              src="@/assets/icons/edit.svg"
              alt="example"
            />
            <p v-t="'account.edit'" />
          </div>
          <div class="user_profile_text_edit edit" v-else>
            <p @click="changeUserName" v-t="'account.save'" />
            <p @click="editingName = false" v-t="'account.cancel'" />
          </div>
        </div>
      </div>
      <div class="user_statistics">
        <div class="user_statistics_wrapper" v-if="userConcerts">
          <div class="user_statistics_container">
            <p class="user_statistics_number">{{ userConcerts.participations }}</p>
            <p class="user_statistics_text" v-t="'account.participated'" />
          </div>
          <div class="user_statistics_container">
            <p class="user_statistics_number">0</p>
            <p class="user_statistics_text" v-t="'account.won'" />
          </div>
          <div class="user_statistics_container">
            <p class="user_statistics_number">{{ userConcerts.likes }}</p>
            <p class="user_statistics_text" v-t="'account.voted'" />
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
            <span v-t="'account.most-votes'" />
            <p v-t="'account.never-won'" />
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
        <p class="user_balans_text" v-t="'account.balance'" />
        <p class="user_balans_maining">
          {{ user.balance }}
        </p>
        <!-- <a class="btn_style btn_add"><span v-t="'account.top-up'" /></a> -->
      </div>
    </div>
    <div class="contests">
      <!-- <div class="contests_title"><p v-t="'account.contests'" /></div> -->
      <!-- <div class="contests_container">
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
              <div class="text" v-t="'account.place'" />
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
      </div> -->
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      name: '',
      last_name: '',
      city: '',
      age: '',
      editingName: false
    }
  },

  created() {
    if (!this.user)
      this.$router.push('/');
    else this.getUserConcerts();
  },

  computed: {
    ...mapState(['user', 'userConcerts'])
  },

  methods: {
    ...mapActions(['uploadAvatar', 'changeName', 'getUserConcerts']),

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.uploadAvatar(file);
      }
    },

    changeUserName() {
      this.changeName({
        name: this.name.trim() || this.user.name,
        last_name: this.last_name.trim() || this.user.last_name,
        city: this.city.trim() || this.user.city,
        age: Math.min(this.age.toString().trim(), 90) || this.user.age
      }).then(() => {
        this.editingName = false;
        this.name = '';
        this.last_name = '';
        this.city = '';
        this.age = '';
      });
    }
  }
};
</script>

<style></style>
