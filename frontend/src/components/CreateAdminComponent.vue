<template>
  <div class="admin-register">
    <h2>Реєстрація Адміністратора</h2>
    <form @submit.prevent="registerAdmin">
      <div>
        <label for="email">Email:</label>
        <input
          type="email"
          v-model="email"
          name="email"
          placeholder="Введіть email"
          required
        />
      </div>

      <div>
        <label for="password">Пароль:</label>
        <input
          type="password"
          v-model="password"
          name="password"
          placeholder="Введіть пароль"
          required
        />
      </div>

      <div>
        <label for="confirmPassword">Підтвердження пароля:</label>
        <input
          type="password"
          v-model="confirmPassword"
          name="confirmPassword"
          placeholder="Підтвердьте пароль"
          required
        />
      </div>

      <button type="submit">Зареєструватися</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    async registerAdmin() {
      if (!this.isAdmin()) {
        alert('Ви не є адміністратором')
        return
      }

      this.errorMessage = ''
      this.successMessage = ''

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Паролі не збігаються'
        return
      }

      const adminData = {
        email: this.email,
        password: this.password,
      }

      try {
        await axios.post('/api/users/signupForAdmins', adminData)
        alert('Адміністратор успішно зареєстрований')
        this.clearForm()
      } catch (error) {
        alert('Помилка при реєстрації адміністратора')
      }
    },
    clearForm() {
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    },
  },
};
</script>
