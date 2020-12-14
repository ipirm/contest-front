import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '../locales'
import lsService from '../services/lsService'

import api from '@/utils/apiRequest'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: null,
		concert: null,
		userConcerts: null,
		participants: null,
		lastQuery: null,
		locale: lsService.getLocale(),

		searchNumber: 0,

		page: 0,
		searchQuery: '',
		searchLoading: false
	},

	mutations: {
		setUser (state, user) {
			state.user = user;
		},

		removeUser (state) {
			state.user = null;
		},

		setLastQuery (state, query) {
			state.lastQuery = query;
		},

		setConcert (state, concert) {
			state.concert = concert;
		},

		setParticipants (state, participants) {
			state.page = 0;
			state.participants = [];
			Vue.prototype.$nextTick(() => {
				state.participants = participants;
			});
		},

		addParticipants (state, participants) {
			state.participants.items.push(...participants.items);
		},

		increasePage(state) {
			state.page++;
		},

		increaseSearchNumber(state) {
			state.searchNumber++;
		},

		setTotal(state, data) {
			state.total = data;
		},

		setLocale (state, locale) {
			state.locale = locale;
			lsService.setLocale(locale);
			i18n.locale = locale;
		},

		setPage (state, page) {
			state.page = page;
		},

		setSearchQuery (state, query) {
			state.searchQuery = query;
		},

		setSearchLoading (state, status) {
			state.searchLoading = status;
		},

		setUserConcerts (state, concerts) {
			state.userConcerts = concerts;
		}
	},

	actions: {
		async getUser({ commit }) {
			const res = await api.get('api/auth/profile', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('auth_token')}`
				}
			});
			if (res.data) {
				commit('setUser', res.data);
			}
		},

		async uploadAvatar({ dispatch }, file) {
			let formData = new FormData();
			formData.append('file', file);

			await api.postFormData('api/user/avatar', formData).then(res => {
				if (res.data) {
					this._vm.$toasted.success(i18n.t('toasted.success.avatar'));
					dispatch('getUser');
				}
			}).catch(e => {
				this._vm.$toasted.error(i18n.t('toasted.error.avatar'));
				console.error(e);
			});
		},

		async search({ commit, state, dispatch }, data) {
			commit('setSearchQuery', data.searchString.trim() || '');
			commit('setLastQuery', data.query || null);
			commit('setSearchLoading', true);
			commit('increaseSearchNumber');

			if (data.searchString.trim() != '') {
				const res = await api.get(`api/concerts/search/data?id=1&search=${data.searchString}&page=${state.page + 1}&limit=15` + (data.query ? `&sort_by=${data.query}` : ''));
				if (res.data) {
					commit('setParticipants', res.data);
				}
			} else dispatch('getParticipants', data.query);
		
			commit('setSearchLoading', false);
		},

		async getConcert({ commit }) {
			const res = await api.get('api/concerts/1');
			if (res.data) {
				commit('setConcert', res.data);
			}
		},

		async getParticipants({ commit, state }, query) {
			commit('setLastQuery', query || null);
			commit('increaseSearchNumber');

			let random;
			if (query === 'random') {
				random = true;
				query = null;
			}

			let res;
			if (state.user) {
				res = await api.get(`api/concerts/concertUsers/1?limit=15&page=${state.page + 1}` + (query ? `&sort_by=${query}` : ''));
			} else {
				res = await api.get(`api/concerts/concertUsersWithOutAuth/1?limit=15&page=${state.page + 1}` + (query ? `&sort_by=${query}` : ''));
			}
			if (!random) {
				commit('setParticipants', res.data);
			} else if (res.data && res.data.items) {
				let items = res.data.items.sort(() => .5 - Math.random());
				delete res.data.items;
				commit('setParticipants', {
					...res.data,
					items
				})
			}
		},

		async getParticipantsByLinkID({ commit, state }, referrerID) {
			commit('increaseSearchNumber');
			let res;
			if (state.user) {
				res = await api.get(`api/concerts/concertUsers/1?limit=15&page=${state.page + 1}&linkID=${referrerID}`);
			} else {
				res = await api.get(`api/concerts/concertUsersWithOutAuth/1?limit=15&page=${state.page + 1}&linkID=${referrerID}`);
			}
			commit('setParticipants', res.data);
		},

		async getMoreParticipants({ commit, state }, query) {
			commit('setLastQuery', query || null);
			commit('increaseSearchNumber');

			let res;
			if (state.user) {
				res = await api.get(`api/concerts/concertUsers/1?limit=15&page=${state.page + 1}` + (query ? `&sort_by=${query}` : ''));
			} else {
				res = await api.get(`api/concerts/concertUsersWithOutAuth/1?limit=15&page=${state.page + 1}` + (query ? `&sort_by=${query}` : ''));
			}

			commit('addParticipants', res.data);
		},

		async getUserConcerts({ commit, state }) {
			if (state.user) {
				const res = await api.get(`api/user/${state.user.id}`);
				if (res.data) {
					commit('setUserConcerts', res.data);
				}
			}
		},

		async like({dispatch, state}, data) {
			if (state.user) {
				await api.post(data.isLike ? 'api/like' : 'api/like/delete', {
					concertId: '1',
					userId: data.userId.toString()
				}).then(() => {
					dispatch('getParticipants', state.lastQuery);
				}).catch(e => {
					this._vm.$toasted.error(i18n.t('toasted.error.like'));
					console.log(e);
				});
			}
		},

		async changeName({dispatch}, data) {
			await api.put('api/user/edit', data)
				.then(res => {
					if (res.data) {
						this._vm.$toasted.success(i18n.t('toasted.success.user-data'));
						dispatch('getUser');
					}
				})
				.catch(e => {
					this._vm.$toasted.error(i18n.t('toasted.error.user-data'));
					console.log(e);
				})
		},

		async participate({dispatch, state}, payload) {
			let formData = new FormData();
			formData.append('concertId', '1');
			payload.map(f => f.file).forEach(f => {
				formData.append('files', f);	
			});

			await api.postFormData('api/participation', formData)
				.then(res => {
					if (res.data === 'This user exists in 1 concert') this._vm.$toasted.error(i18n.t('toasted.error.participation-already'));
					else {
						this._vm.$toasted.success(i18n.t('toasted.success.participation'));
						dispatch('getParticipants', state.lastQuery);
						dispatch('getConcert');
					}
				})
				.catch(e => {
					this._vm.$toasted.error(i18n.t('toasted.error.participation'));
					console.log(e);
				});
		}
	}
});