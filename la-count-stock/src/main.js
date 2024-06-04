import './assets/main.css'
import 'primeicons/primeicons.css'
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
    
    if (to.matched.some((record) => !record.meta.isLoginPage)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
      
        if (!auth.isLoggedIn ) {
            next({ name: 'Login', query: { route: to.path } });
        } else {
            next();
        }

    } else {
        
        if (auth.isLoggedIn) {
            next({ name: 'Home' });
        } else {
            next();
        }
    }
});

app.mount('#app')


