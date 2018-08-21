import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import store from './store';
// import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import './assets/public.css';




Vue.use(iView);


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});