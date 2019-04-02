import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase';
import Vuetify from 'vuetify';
import VueSweetalert2 from 'vue-sweetalert2';

import '@fortawesome/fontawesome-free/css/all.css';

import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import config from './config';
import './registerServiceWorker';

Vue.use(Vuetify, {
 iconfont: 'fa'
})

Vue.config.productionTip = false;
Vue.use(VueFire)
Vue.use(VueSweetalert2);

let app:any = '';
firebase.initializeApp(config.FIREBASE);

export const db = firebase.firestore();

firebase.auth().onAuthStateChanged(() => {
  app = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
})

