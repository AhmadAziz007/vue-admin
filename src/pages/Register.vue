<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please register</h1>

      <input v-model="firstName" class="form-control" placeholder="First Name" required>

      <input v-model="lastName" class="form-control" placeholder="Last Name" required>

      <input v-model="email" type="email" class="form-control" placeholder="name@example.com" required>

      <input v-model="password" type="password" class="form-control" placeholder="Password" required>

      <input v-model="passwordConfirm" type="password" class="form-control" placeholder="Password Confirm" required>

      <button class="w-100 btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  </main>
</template>

<script lang="ts">
import {ref} from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';

export default {
  name: 'App',
  setup() {
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const passwordConfirm = ref('');
    // eslint-disable-next-line no-undef
    const router = useRouter();

    const submit = async () => {
      const {data} = await axios.post('register', {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        password_confirm: passwordConfirm.value,
      });
      console.log(data);
      await router.push('/login');
    };

    return {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      submit,
    };
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
}

.form-signin {
  max-width: 330px;
  padding: 1rem;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
