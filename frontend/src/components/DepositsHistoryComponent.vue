<template>
  <div class="deposit-history">
    <h2>Deposit History</h2>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <table v-if="depositHistory.length" class="history-table">
      <thead>
      <tr>
        <th>Deposit Number</th>
        <th>Balance</th>
        <th>Currency</th>
        <th>Interest Per Year</th>
        <th>Expiry Date</th>
        <th>Date of Creation</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="deposit in depositHistory" :key="deposit.id">
        <td>{{ deposit.depositNumber }}</td>
        <td>{{ deposit.balance.toFixed(2) }}</td>
        <td>{{ deposit.currency }}</td>
        <td>{{ deposit.interestPerYear }}%</td>
        <td>{{ formatDate(deposit.expiryDate) }}</td>
        <td>{{ formatDate(deposit.dateOfCreation) }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>No deposits found</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      depositHistory: [],
      errorMessage: "",
    };
  },
  methods: {
    async fetchDepositHistory() {
      try {
        const response = await axios.get(`/api/deposits/checkDepositHistory/${this.userId}`);
        this.depositHistory = response.data;
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Failed to fetch deposit history";
        console.error(error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
  },
  created() {
    this.userId = this.$route.params.userId;
    this.fetchDepositHistory();
  },
};
</script>

<style scoped>
.deposit-history {
  max-width: 800px;
  margin: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.history-table th,
.history-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.history-table th {
  background-color: #f4f4f4;
}

.error-message {
  color: red;
}
</style>
