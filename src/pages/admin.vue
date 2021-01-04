<template>
	<div class="admin-page" v-if="this.user && this.user.role === 'admin' && participants">
    <sorted-table :values="participants.items || []">
      <thead>
      <tr>
        <th scope="col" style="width: 50px">
          <span>ID</span>
        </th>
        <th scope="col" style="width: 200px">
          <span>First Name</span>
        </th>
        <th scope="col" style="width: 200px">
          <span>Last Name</span>
        </th>
        <th scope="col" style="width: 400px">
          <span>Pictures</span>
        </th>
        <th scope="col" style="width: 300px">
          <span>Approved</span>
        </th>
      </tr>
      </thead>
      <tbody slot="body" slot-scope="sort">
        <tr
            v-for="(participant, i) in sort.values"
            :key="`${searchNumber}-${i}`"
        >
          <td>
            <span>{{ participant.userId }}</span>
          </td>
          <td>
            <span>{{ participant.user.name }}</span>
          </td>
          <td><span>{{ participant.user.last_name }}</span></td>
          <td>
            <admin-swiper :participant="participant" />
          </td>
          <td>
            <button class="admin-page__button" :class="{active: approveList[i]}" @click="onButtonClick(i, participant.userId)"></button>
          </td>
        </tr>
      </tbody>
    </sorted-table>
	</div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
  components: {
    AdminSwiper: () => import('@/components/AdminSwiper.vue')
  },

  data() {
    return {
      page: 1,

      approveList: []
    }
  },

  created() {
    this.setParticipants(null);

    if (this.user && this.user.role === 'admin') {
      this.getAdminTable({page: this.page});
    } else {
      this.$router.push('/')
    }
  },

  watch: {
    participants: {
      handler() {
        if (this.participants && this.participants.items && this.participants.items.length)
          this.approveList = this.participants.items.map(i => i.approve);
      },
      immediate: true
    }
  },

  computed: {
    ...mapState(['user', 'participants', 'searchNumber'])
  },

  methods: {
    ...mapActions(['getAdminTable', 'setApproveStatus']),
    ...mapMutations(['setParticipants']),

    onButtonClick(i, id) {
      this.approveList[i] = !this.approveList[i];
      this.approveList.push({})
      this.approveList.pop()
      this.setApproveStatus({
        approve: this.approveList[i],
        id
      }).catch(() => {
        this.approveList[i] = !this.approveList[i];
        this.approveList.push({})
        this.approveList.pop()
      })
    }
  }
}
</script>