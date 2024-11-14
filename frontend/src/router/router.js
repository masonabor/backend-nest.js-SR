import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/LoginComponent.vue';
import UserPageComponent from '@/components/UserInfo.vue';
import AdminPageComponent from '@/components/AdminPageComponent.vue';
import CreateAdminComponent from '@/components/CreateAdminComponent.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: LoginComponent
    },
    {
      path: "/userInfo",
      name: "UserInfo",
      component: UserPageComponent
    },
    {
      path: "/adminPage",
      name: "AdminPage",
      component: AdminPageComponent
    },
    {
      path: "/createAdmin",
      name: "CreateAdmin",
      component: CreateAdminComponent
    }]
})
