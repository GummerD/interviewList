import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'



import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura';


//компопненты PRIMEVUE:
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import Message from 'primevue/message';


// подключение к БД (последовтельность инструкций имеет значение):
import { initializeApp } from "firebase/app"; //1

const firebaseConfig = { //2
    apiKey: "AIzaSyDiEP5WMExpgXE9RyKd35dDjAXVLCUIczA",
    authDomain: "interviewlist-11.firebaseapp.com",
    projectId: "interviewlist-11",
    storageBucket: "interviewlist-11.appspot.com",
    messagingSenderId: "680036692440",
    appId: "1:680036692440:web:6e89f68165d45b48db42ad"
};

initializeApp(firebaseConfig);//3

import { getFirestore} from 'firebase/firestore';//4
export const db = getFirestore();//4

import App from './App.vue'//1
import router from './router'//2

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use( PrimeVue, {
    theme: {
        preset: Aura
    }
})
app.use(ToastService)
app.use(ConfirmationService)

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-spinner', ProgressSpinner)
app.component('app-card', Card)
app.component('app-table', DataTable)
app.component('app-column', Column)
app.component('app-confirm-dialog', ConfirmDialog)
app.component('app-message', Message)

app.mount('#app')
