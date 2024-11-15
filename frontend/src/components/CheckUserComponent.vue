<template>
  <div class="admin-panel">
    <h2>Admin Panel - User Management</h2>
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Banned:</strong> {{ user.banned ? "Yes" : "No" }}</p>
      <p v-if="user.banReason"><strong>Ban Reason:</strong> {{ user.banReason }}</p>

      <button @click="toggleBanUser">
        {{ user.banned ? "Unban User" : "Ban User" }}
      </button>
      <input v-if="!user.banned" type="text" v-model="banReason" placeholder="Ban Reason" />

      <h3>Accounts</h3>
      <ul v-if="user.accounts && user.accounts.length">
        <li v-for="(account, index) in user.accounts" :key="index">
          <p><strong>Account Number:</strong> {{ account.accountNumber }}</p>
          <p><strong>Balance:</strong> {{ account.balance }} {{ account.currency }}</p>

          <div>
            <h4>Deposits</h4>
            <ul v-if="account.deposits && account.deposits.length">
              <li v-for="(deposit, depIndex) in account.deposits" :key="depIndex">
                <p><strong>Deposit Number:</strong> {{ deposit.depositNumber }}</p>
                <p><strong>Balance:</strong> {{ deposit.balance }} {{ deposit.currency }}</p>
                <p><strong>Interest per Year:</strong> {{ deposit.interestPerYear }}%</p>
                <input type="number" v-model="deposit.newInterestRate" placeholder="New Interest Rate" />
                <button @click="updateInterestRate(deposit)">Update Interest Rate</button>
              </li>
            </ul>
            <p v-else>No deposits available for this account.</p>
          </div>
        </li>
      </ul>
      <p v-else>No accounts available.</p>
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
      banReason: '',
      isAdmin: false,
    };
  },
  async created() {
    this.token = sessionStorage.getItem('token');
    try {
      if (this.token) {
        const response = await axios.post(
          '/api/users/getAdmin',
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
        this.isAdmin = response.data.isAdmin;

        if (!this.isAdmin) {
          console.warn("У вас немає прав адміністратора.");
        }

        const userID = this.$route.params.userID;
        if (userID) {
          try {
            const response = await axios.get(`/api/users/${userID}`, {
              headers: { Authorization: `Bearer ${this.token}` },
            });
            this.user = response.data;
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        }

      } else {
        console.error("Admin session not found.");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  },
  methods: {
    async toggleBanUser() {
      try {
        const data = { user: this.user, reason: this.banReason };

        await axios.post(`/api/admin/users/banUser`, data, {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        this.user.banned = !this.user.banned;
        this.user.banReason = this.user.banned ? this.banReason : null;
        this.banReason = '';
        console.log(`User ${this.user.banned ? 'banned' : 'unbanned'} successfully`);
      } catch (error) {
        console.error("Failed to toggle ban status:", error);
      }
    }
  }
};
</script>

