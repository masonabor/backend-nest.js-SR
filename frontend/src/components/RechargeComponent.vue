<template>
  <div class="deposit-form">
    <h2>Deposit to Account</h2>

    <form @submit.prevent="submitDeposit">
      <div>
        <label for="account">Select Account:</label>
        <select v-model="selectedAccount" required>
          <option v-for="account in accounts" :key="account.id" :value="account.id">
            Account {{ account.accountNumber }} - Balance: {{ account.balance }} {{ account.currency }}
          </option>
        </select>
      </div>

      <div>
        <label for="amount">Amount:</label>
        <input type="number" v-model.number="amount" min="1" required />
      </div>

      <button type="submit">Deposit</button>
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
    const accounts = ref([]);
    const selectedAccount = ref('');
    const amount = ref(0);
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


    const submitDeposit = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        errorMessage.value = 'User is not authenticated';
        return;
      }

      try {
        const response = await axios.post(
          `/api/accounts/deposit/${selectedAccount.value}`,
          { amount: amount.value },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        successMessage.value = `Successfully deposited ${amount.value} to account`;
        errorMessage.value = '';
        amount.value = 0;
        updateAccountBalance(selectedAccount.value, response.data.balance);
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to deposit';
        successMessage.value = '';
        console.error(error);
      }
    };

    const updateAccountBalance = (accountId, newBalance) => {
      const account = accounts.value.find(acc => acc.id === accountId);
      if (account) {
        account.balance = newBalance;
      }
    };

    return {
      accounts,
      selectedAccount,
      amount,
      successMessage,
      errorMessage,
      submitDeposit
    };
  }
};
</script>

<style scoped>
.deposit-form {
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
