import { createApp } from 'vue'
import Creator from './Creator.vue'
import App from './App.vue'
import Home from './Home.vue'
import router from "@/router"

createApp(App)
  .use(router)
  .mount('#app')
