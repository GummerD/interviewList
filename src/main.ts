import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import { initializeApp } from "firebase/app";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';



import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyDiEP5WMExpgXE9RyKd35dDjAXVLCUIczA",
    authDomain: "interviewlist-11.firebaseapp.com",
    projectId: "interviewlist-11",
    storageBucket: "interviewlist-11.appspot.com",
    messagingSenderId: "680036692440",
    appId: "1:680036692440:web:6e89f68165d45b48db42ad"
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use( PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(ToastService)

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-spinner', ProgressSpinner)
app.component('app-card', Card)

app.mount('#app')
