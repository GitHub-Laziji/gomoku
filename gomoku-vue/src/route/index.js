import { createRouter, createWebHashHistory } from "vue-router";
export const routes = [
  
]
export default createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})