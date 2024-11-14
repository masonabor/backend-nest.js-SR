<template>
  <div class="transaction-page">
    <h2>Create a Transaction</h2>
    <form @submit.prevent="submitTransaction">
      <div>
        <label for="fromAccount">From Account:</label>
        <select v-model="transactionData.fromAccountNumber" required>
          <option v-for="account in accounts" :key="account.id" :value="account.accountNumber">
            {{ account.accountNumber }} - Balance: {{ account.balance }} {{ account.currency }}
          </option>
        </select>
      </div>

      <div>
        <label for="toAccount">To Account Number:</label>
        <input type="number" v-model.number="transactionData.toAccountNumber" required />
      </div>

      <div>
        <label for="amount">Amount:</label>
        <input type="number" v-model.number="transactionData.amountFromCurrency" required />
      </div>

      <button type="submit">Submit Transaction</button>
    </form>

    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const transactionData = ref({
      fromAccountNumber: null,
      toAccountNumber: null,
      amountFromCurrency: null,
    });
    const accounts = ref([]);

    const successMessage = ref('');
    const errorMessage = ref('');

    onMounted(async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        errorMessage.value = 'User is not authenticated';
        return;
      }

      try {
        const response = await axios.post('/api/users/getAll', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        accounts.value = response.data.accounts || [];
      } catch (error) {
        errorMessage.value = 'Failed to load accounts';
        console.error(error);
      }
    });

    const submitTransaction = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        errorMessage.value = 'User is not authenticated';
        return;
      }

      try {
        await axios.post('/api/transactions/transaction', transactionData.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        successMessage.value = 'Transaction completed successfully';
        errorMessage.value = '';

        transactionData.value = {
          fromAccountNumber: null,
          toAccountNumber: null,
          amountFromCurrency: null,
        };
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to complete transaction';
        successMessage.value = '';
        console.error(error);
      }
    };

    return {
      transactionData,
      accounts,
      successMessage,
      errorMessage,
      submitTransaction,
    };
  },
};
</script>

<style scoped>
.transaction-page {
  max-width: 500px;
  margin: auto;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
