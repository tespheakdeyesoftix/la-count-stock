import './assets/main.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import { createApp,reactive } from 'vue'
import App from './App.vue'
import router from './router'
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import CountProduct from './utils/index';

const app = createApp(App)

app.use(router)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
const countProduct = reactive(new CountProduct());
app.provide("$countProduct", countProduct);
app.mount('#app')
