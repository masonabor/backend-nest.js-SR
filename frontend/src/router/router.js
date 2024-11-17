import { createRouter, createWebHistory } from 'vue-router'
import LoginComponent from '@/components/LoginComponent.vue';
import UserPageComponent from '@/components/UserPageComponent.vue';
import AdminPageComponent from '@/components/AdminPageComponent.vue';
import CreateAdminComponent from '@/components/CreateAdminComponent.vue';
import CreateAccountComponent from '@/components/CreateAccountComponent.vue';
import CreateTransactionComponent from '@/components/CreateTransactionComponent.vue';
import RechargeComponent from '@/components/RechargeComponent.vue';
import CheckUserComponent from '@/components/CheckUserComponent.vue';
import CreateDepositComponent from '@/components/CreateDepositComponent.vue';
import WithdrawPageComponent from '@/components/WithdrawPageComponent.vue';
import DepositsHistoryComponent from '@/components/DepositsHistoryComponent.vue';

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
    },
    {
      path: "/createAccount",
      name: "CreateAccount",
      component: CreateAccountComponent
    },
    {
      path: "/createTransaction",
      name: "CreateTransaction",
      component: CreateTransactionComponent
    },
    {
      path: "/recharge",
      name: "Recharge",
      component: RechargeComponent
    },
    {
      path: "/user:userId",
      name: "UserInfoForAdmin",
      component: CheckUserComponent
    },
    {
      path: "/createDeposit:accountId",
      name: "CreateDeposit",
      component: CreateDepositComponent
    },
    {
      path: "/withdraw",
      name: "Withdraw",
      component: WithdrawPageComponent
    },
    {
      path: '/depositsHistory/:userId',
      name: "DepositsHistory",
      component: DepositsHistoryComponent
    }]
})
