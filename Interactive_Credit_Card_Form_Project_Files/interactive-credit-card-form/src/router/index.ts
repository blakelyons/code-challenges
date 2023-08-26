import {createRouter, createWebHistory} from "vue-router";
import InteractiveCreditCardFormView from "@/views/InteractiveCreditCardFormView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: InteractiveCreditCardFormView,
        },
    ],
});

export default router;
