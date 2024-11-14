<template>
  <div class="create-account">
    <h2>Create a New Account</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="currency">Select Currency:</label>
        <select v-model="accountData.currency" id="currency" required>
          <option v-for="currency in currencies" :key="currency" :value="currency">
            {{ currency }}
          </option>
        </select>
      </div>
      <button type="submit">Create Account</button>
    </form>

    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      accountData: {
        currency: ''
      },
      currencies: ['USD', 'EUR', 'UAH'],
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async submitForm() {
      try {
        const token = sessionStorage.getItem('token');

        await axios.post('/api/accounts/createAccount', this.accountData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.successMessage = 'Account created successfully!';
        this.errorMessage = '';
        this.accountData.currency = '';

      } catch (error) {
        this.successMessage = '';
        this.errorMessage = error.response?.data?.message || 'An error occurred while creating the account';
      }
    }
  }
};
</script>

<style scoped>
.create-account {
  max-width: 400px;
  margin: auto;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
