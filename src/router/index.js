import VueRouter from 'vue-router'
import Vue from 'vue'
import store from '../store';

const Account = () => import(/* webpackChunkName: "account" */ '../pages/account.vue')
const TextPage = () => import(/* webpackChunkName: "textPage" */ '../pages/_text-page.vue')
const Index = () => import(/* webpackChunkName: "index" */ '../pages/index.vue')
const Admin = () => import(/* webpackChunkName: "index" */ '../pages/admin.vue')

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/account',
            component: Account,
            name: 'account'
        },
        {
            path: '/admin',
            component: Admin,
            name: 'admin'
        },
        {
            path: '/:name',
            component: TextPage,
            props: true,
            name: 'text-page'
        },
        {
            path: '/',
            component: Index,
            name: 'index'
        },
        {
            path: '*',
            redirect: 'index'
        }
    ]
})


router.beforeEach(async (to, from, next) => {
    if (window.location.search.includes('?access_token')) {
        const authToken =  window.location.search.replace('?access_token=', '');
        if (authToken) {
          localStorage.setItem('auth_token', authToken);
        }
        if (window.location.search.replace('?access_token=', '')) {
            // window.location.href = window.location.origin;
            // router.push('/', {query: {}});
            setTimeout(() => {
                window.history.replaceState(null, null, window.location.pathname);
            }, 1000);
        }
    }

    if (localStorage.getItem('auth_token'))
      await store.dispatch('getUser');

    next();
});


export default router