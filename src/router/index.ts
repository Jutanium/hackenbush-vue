import {createRouter, createWebHistory} from "vue-router"
import Creator from "@/pages/Creator.vue";
import Demo from "@/pages/Demo.vue";
import Play from "@/pages/Play.vue";
import Explorable from "@/pages/Explorable.vue"


const routes = [
  {path: '/', name: "Explorable", component: Explorable},
  {path: '/demo', name: "Demo", component: Demo},
  {path: '/creator', name: "Creator", component: Creator},
  {path: '/play/:file', component: Play, props: true}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;