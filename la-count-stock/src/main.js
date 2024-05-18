import './assets/main.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ConfirmationService from 'primevue/confirmationservice';


const app = createApp(App)

app.use(router)
app.use(PrimeVue);
app.use(ConfirmationService);
app.mount('#app')
