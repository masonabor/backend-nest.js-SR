<template>
  <div class="register-page">
    <h2>Register</h2>
    <form @submit.prevent="registerUser">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="Enter your email"
          required
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="Enter your password"
          required
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="Confirm your password"
          required
        />
        <span
          v-if="errors.confirmPassword"
          class="error-message"
        >{{ errors.confirmPassword }}</span>
      </div>

      <button type="submit" :disabled="isSubmitting">Register</button>
      <p v-if="serverError" class="error-message">{{ serverError }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {},
      serverError: null,
      isSubmitting: false,
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.email) {
        this.errors.email = "Email is required.";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.form.email)) {
        this.errors.email = "Invalid email format.";
      }

      if (!this.form.password) {
        this.errors.password = "Password is required.";
      } else if (this.form.password.length < 8) {
        this.errors.password = "Password must be at least 8 characters.";
      }

      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = "Please confirm your password.";
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match.";
      }

      return Object.keys(this.errors).length === 0;
    },
    async registerUser() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      this.serverError = null;

      try {
        await axios.post("/api/users/createUser", {
            email: this.form.email,
            password: this.form.password,
        });

        alert("Registration successful!");
        this.$router.push("/");
      } catch (error) {
        if (error.response && error.response.data) {
          this.serverError = error.response.data.message;
        } else {
          this.serverError = "An unexpected error occurred.";
        }
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}
</style>
