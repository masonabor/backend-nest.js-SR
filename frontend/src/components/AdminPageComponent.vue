<template>
  <div v-if="isAdmin">
    <h2>Користувачі:</h2>
    <table v-show="users.length">
      <thead>
      <tr>
        <th>Email</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.email">
        <td>{{ user.email }}</td>
        <td>
          <button @click="viewUserInfo(user)">Інфо та редагування</button>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-if="!users.length">Немає доступних користувачів.</p>
    <button @click="registerAdmin">Зареєструвати нового адміністратора</button>
  </div>
  <div v-else>
    <p>У вас немає доступу до цієї сторінки.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      isAdmin: false,
      token: ''
    };
  },
  async created() {
    this.token = sessionStorage.getItem('token');
    if (!this.token) {
      console.error("Токен не знайдено. Будь ласка, увійдіть.");
      return;
    }

    try {
      const decoded = await axios.post('/api/users/getAdmin', {}, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      this.isAdmin = decoded.data.isAdmin;
      if (this.isAdmin) {
        this.fetchUsers();
      } else {
        console.warn("У вас немає прав адміністратора.");
      }
    } catch (error) {
      console.error("Не вдалося перевірити права адміністратора:", error);
    }
  },
  methods: {
    fetchUsers() {

      axios.get('/api/users/getAllUsers', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error("Не вдалося отримати користувачів", error);
        });
    },
    viewUserInfo(user) {
      this.$router.push('/userInfoForAdmin', user);
    },
    registerAdmin() {
      if (this.isAdmin) {
        this.$router.push({ name: 'CreateAdmin' });
      }
    }
  }
};
</script>

