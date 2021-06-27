import {createRouter, createWebHistory} from "vue-router"
import Creator from "@/Creator.vue";
import Home from "@/Home.vue";
import Play from "@/Play.vue";


const routes = [
  {path: '/', name: "Home", component: Home},
  {path: '/creator', name: "Creator", component: Creator},
  {path: '/play/:file', component: Play, props: true}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;