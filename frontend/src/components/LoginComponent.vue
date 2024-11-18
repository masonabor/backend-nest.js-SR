<template>
  <div class="login-container">
    <h2>Вхід</h2>
    <form @submit.prevent="login">
      <div>
        <label>Електронна пошта</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Пароль</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Увійти</button>
    </form>
    <button type="submit" @click="createUser">Зареєструватися</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import VueJwtDecode from 'vue-jwt-decode'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('api/auth/login', {
          email: this.email,
          password: this.password,
        });
        const token = response.data.access_token;
        sessionStorage.setItem('token', token);
        try {
          const decodedToken = VueJwtDecode.decode(token);
          if (decodedToken.isAdmin) {
            this.$router.push('/adminPage');
          } else {
            this.$router.push('/userInfo');
          }
        } catch (decodeError) {
          console.error("JWT Decode Error:", decodeError);
          this.errorMessage = 'Проблема з токеном авторизації';
        }
      } catch (error) {
        this.errorMessage = 'Невірний email або пароль';
      }
    },
    async createUser() {
      this.$router.push('/createUser');
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
