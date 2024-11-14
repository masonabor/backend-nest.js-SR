<template>
  <div class="user-info">
    <h2>User Information</h2>
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Banned:</strong> {{ user.banned ? "Yes" : "No" }}</p>
      <p v-if="user.banReason"><strong>Ban Reason:</strong> {{ user.banReason }}</p>

      <div>
        <h3>Accounts</h3>
        <ul v-if="user.accounts && user.accounts.length">
          <li v-for="(account, index) in user.accounts" :key="index">
            <p><strong>Account Number:</strong> {{ account.accountNumber }}</p>
            <p><strong>Balance:</strong> {{ account.balance }} {{ account.currency }}</p>
            <button @click="createDeposit" v-if="!user.isAdmin">Create New Account</button>

            <div>
              <h4>Deposits</h4>
              <ul v-if="account.deposits && account.deposits.length">
                <li v-for="(deposit, depIndex) in account.deposits" :key="depIndex">
                  <p><strong>Deposit Number:</strong> {{ deposit.depositNumber }}</p>
                  <p><strong>Balance:</strong> {{ deposit.balance }} {{ deposit.currency }}</p>
                  <p><strong>Interest per Year:</strong> {{ deposit.interestPerYear }}%</p>
                </li>
              </ul>
              <p v-else>No deposits available for this account.</p>
            </div>
          </li>
        </ul>
        <p v-else>No accounts available.</p>
        <button @click="createAccount" v-if="!user.isAdmin">Create New Account</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode'

export default {
  data() {
    return {
      user: null
    }
  },
  async created() {
      const token = sessionStorage.getItem('token');
      try {
        const decodedToken = VueJwtDecode.decode(token);
        if (decodedToken && decodedToken.email) {
          const response = await axios.post('/api/users/getAll', { email: decodedToken.email });
          this.user = {
            ...response.data,
            accounts: response.data.accounts || []
          };
        } else {
          console.error("User session not found.");
        }
      } catch (error) {
        console.log(error);
      }
  },
  methods: {
    createDeposit() {

    },
    createAccount() {

    }
  }
};
</script>
