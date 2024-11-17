<template>
  <div>
    <h2>Create Deposit</h2>
    <form @submit.prevent="createDeposit">
      <div>
        <label for="amount">Amount: </label>
        <input type="number" v-model="amount" id="amount" required />
        <label for="interval">Interval: </label>
        <select v-model="interval" id="interval">
          <option v-for="interval in intervals" :key="interval" :value="interval">
            {{ interval }} year
          </option>
        </select>
      </div>
      <button type="submit">Create</button>
    </form>
    <p>Interest per year: {{ interestPerYear }} %</p>
    <p>{{ ((amount / 100) * interestPerYear) * interval + amount}} for your deposit</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      intervals: ['1', '2', '3'],
      interval: '',
      interestPerYear: 20,
      accountId: 0,
      amount: 0,
      successMessage: '',
      errorMessage: ''
    }
  },
  async mounted() {
    this.accountId = this.$route.params.accountId;
  },
  methods: {
    async createDeposit() {
      try {
        const token = sessionStorage.getItem('token');
        await axios.post('/api/deposits/createDeposit', {
          balance: this.amount,
          interval: this.interval,
          accountId: this.accountId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.successMessage = 'Deposit created successfully!';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred while creating the deposit';
        this.successMessage = ''
      }
    }
  }
}
</script>
