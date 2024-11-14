<template>
  <h2>Користувачі:</h2>
  <table v-show="users">
    <thead>
    <tr>
      <th>Email</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in users" :key="user.email">
      <td>{{ user.email }}</td>
      <td><button @click="viewUserInfo">Інфо та редагування</button></td>
    </tr>
    </tbody>
  </table>
  <button @click="registerAdmin">Зареєструвати нового адміністратора</button>
</template>

<script>
import { isAdmin } from '@/sessionHelper';
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      isAdmin: isAdmin()
    };
  },
  created() {
    if (this.isAdmin) {
      this.fetchUsers();
    }
  },
  methods: {
    fetchUsers() {
      axios.get('/api/users/getAllUsers')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error("Не вдалося отримати користувачів", error);
        });
    },

    viewUserInfo(user) {
      this.$router.push({ name: 'UserInfo', params: { user } });
    },

    registerAdmin() {
      if (this.isAdmin) {
        this.$router.push({ name: 'CreateAdmin' });
      }
    }
  }
};
</script>