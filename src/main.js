import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)


// axios
import axios from "./axios.js";
Vue.prototype.$http = axios;


// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)

import * as VueGoogleMaps from 'vue2-google-maps';
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyB7oQlrkzbgQVWIdsukave_k5CbODacyXQ',//GORE-PRODUCCION
        //key: 'AIzaSyDp3Ud3SixagW8bJOwtosy5bBMB5JRNS_k',//DEVELOPER
        libraries: 'places'
    }
});


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// VeeValidate
import es from 'vee-validate/dist/locale/es';
import VeeValidate, { Validator } from 'vee-validate';
Vue.use(VeeValidate);
Validator.localize("es", es);


// Feather font icon
require('./assets/css/iconfont.css')

router.beforeEach((to, from, next) => {
    let auth = to.matched.some(record => record.meta.requiresAuth);
    let visit = to.matched.some(record => record.meta.requiresVisitor);
    let adminAuth = to.matched.some(record => record.meta.adminAuth);
    if(auth){
        if(adminAuth){
            store.dispatch("role")
            .then(response => {
                if(store.getters.roleUser === "llankasun_realm_admin"){
                    next();
                } else {
                    next('/');
                }
            })
            .catch(err => {
                next('/');
            });
        } else {
            if (!store.getters.isLoggedIn) {
                next('/pages/login');
            } else {
                next();
            }
        }
    } else if(visit) {
        if (store.getters.isLoggedIn) {
			next('/');
		} else {
			next();
		}
    } else {
        next();
    }
});

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store,
    
}).$mount('#app')
