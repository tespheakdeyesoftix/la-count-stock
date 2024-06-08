import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import { createApp,reactive } from 'vue'
import App from './App.vue'
import router from './router'
import Auth from "./utils/auth";
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import CountProduct from './utils/index';
import axios from 'axios'; 

const app = createApp(App)
const auth = reactive(new Auth());
app.use(router)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
const countProduct = reactive(new CountProduct());
app.provide("$countProduct", countProduct);
app.provide("$auth", auth);



router.beforeEach(async (to, from, next) => {
    
        let authentication = undefined
        let current_user = undefined
        if (localStorage.getItem("_authentication")){
            authentication = JSON.parse(localStorage.getItem("_authentication"))
            const str_user_decoded = JSON.stringify(atob(authentication.message))
            current_user = JSON.parse(str_user_decoded.replace(/'/g, '"').replace("\"{","{").replace("}\"","}"))
            auth.isLoggedIn = true
            auth.user = current_user
        }
    
    if (to.matched.some((record) => !record.meta.isLoginPage)) {
        
        if (!auth.isLoggedIn) {
            next({ name: 'Login', query: { route: to.path } });
        } else {
            next();
        }
    } else {
        if (auth.isLoggedIn ) {
            next({ name: 'home' });
        } else {
            next();
        }
    }
});

app.mount('#app')


