<template>
  <div class="account">
    <div class="account-page" v-if="user">
      <div class="account-page__content">
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
              <div class="user_statistics_container" v-if="user && user.concertsUsers && user.concertsUsers[0] && user.concertsUsers[0]">
                <p class="user_statistics_number">{{ user.concertsUsers[0].likesCount }}</p>
                <p class="user_statistics_text" v-t="'account.voted'" />
              </div>
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
        <div class="contests" v-if="user && user.concertsUsers && user.concertsUsers[0] && user.concertsUsers[0].images">
          <div class="contests_title"><p v-t="'account.images'" /></div>
          <div class="contests_container">
            <div
              class="contest_item"
              v-for="(item, i) in user.concertsUsers[0].images"
              :key="i"
              :style="{ backgroundImage: `url(${item.url})` }"
            >
            </div>
          </div>
        </div>
      </div>
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
