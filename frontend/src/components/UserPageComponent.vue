<template>
  <div class="user-info">
    <h2>User Information</h2>
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Banned:</strong> {{ user.banned ? "Yes" : "No" }}</p>
      <p v-if="user.banReason"><strong>Ban Reason:</strong> {{ user.banReason }}</p>
      <button @click="transaction">Create transaction</button>

      <div>
        <h3>Accounts</h3>
        <ul v-if="user.accounts && user.accounts.length">
          <li v-for="(account, index) in user.accounts" :key="index">
            <p><strong>Account Number:</strong> {{ account.accountNumber }}</p>
            <p><strong>Balance:</strong> {{ account.convertedBalance || account.balance}} {{ account.selectedCurrency }}
              <label for="currency"></label>
              <select v-model="account.selectedCurrency" @change="convertCurrency(account)">
                <option v-for="cur in currencies" :key="cur" :value="cur">
                  {{ cur }}
                </option>
              </select>
            </p>
            <button @click="recharge(account.id)">Recharge account</button>
            <button @click="createDeposit">Create New Deposit</button>
            <button @click="deleteAccount(account.id)">Delete Account</button>

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

export default {
  data() {
    return {
      token: '',
      user: null,
      currencies: ['USD', 'EUR', 'UAH'],
    };
  },
  async created() {
    this.token = sessionStorage.getItem('token');
    try {
      if (this.token) {
        const response = await axios.post(
          '/api/users/getAll',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        this.user = {
          ...response.data,
          accounts: response.data.accounts.map(account => ({
            ...account,
            selectedCurrency: account.currency,
            convertedBalance: account.balance,
          })),
        };
      } else {
        console.error("User session not found.");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },
  methods: {
    createDeposit() {

    },
    createAccount() {
      this.$router.push('/createAccount');
    },
    async deleteAccount(id) {
      try {
        await axios.delete(`/api/accounts/deleteAccount/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.user.accounts = this.user.accounts.filter(account => account.id !== id);
        console.log(`Account with id ${id} has been deleted`);
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    },
    transaction() {
      this.$router.push('/createTransaction');
    },
    recharge(id) {
      this.$router.push('/recharge', { id: id });
    },
    async convertCurrency(account) {
      if (account.currency === account.selectedCurrency) {
        account.convertedBalance = account.balance;
        return;
      }

      const fromCurrency = account.currency;
      const toCurrency = account.selectedCurrency;

      try {
        const response = await axios.get(`/api/exchange/convert/${fromCurrency}/${toCurrency}/${account.balance}`);

        account.convertedBalance = response.data.amount || response.data;
      } catch (error) {
        console.error("Currency conversion failed:", error);
      }
    }
  }
};
</script>
