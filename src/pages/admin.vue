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
            <span>{{ participant.id }}</span>
          </td>
          <td>
            <span>{{ participant.user.name }}</span>
          </td>
          <td><span>{{ participant.user.last_name }}</span></td>
          <td>
            <admin-swiper :participant="participant" />
          </td>
          <td>
            <button class="admin-page__button" :class="{active: approveList[i]}" @click="onButtonClick(i, participant.id)"></button>
          </td>
        </tr>
      </tbody>
    </sorted-table>
    <pagination :per-page="perPage" v-model="page" :total-elems="participants.meta.totalItems" v-if="participants && participants.meta && participants.meta.totalPages > 1" />
	</div>
</template>

<script>
import {mapState, mapActions, mapMutations} from 'vuex'

export default {
  components: {
    AdminSwiper: () => import('@/components/AdminSwiper.vue'),
    Pagination: () => import('@/components/Pagination.vue')
  },

  data() {
    return {
      page: 1,
      perPage: 10,

      approveList: []
    }
  },

  created() {
    this.setParticipants(null);

    if (this.user && this.user.role === 'admin') {
      this.getAdminTable({page: this.page, perPage: this.perPage});
    } else {
      this.$router.push('/')
    }
  },

  watch: {
    participants: {
      handler() {
        if (this.participants && this.participants.items && this.participants.items.length) {
          this.approveList = this.participants.items.sort((a, b) => (a.id > b.id) ? 1 : -1).map(i => i.approve);
          this.approveList.push({})
          this.approveList.pop()
        }
      }
    },

    page: {
      handler() {
        this.getAdminTable({page: this.page, perPage: this.perPage});
      }
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