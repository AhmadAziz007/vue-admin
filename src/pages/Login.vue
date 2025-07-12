<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="submit">
      <h1 class="h3 mb-3 fw-normal">Please sign-in</h1>

      <input v-model="form.email" type="email" class="form-control" placeholder="name@example.com" required>

      <input v-model="form.password" type="password" class="form-control" placeholder="Password" required>

      <button class="w-100 btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
  </main>
</template>

<script>
import {reactive} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

export default {
  name: "App",
  setup() {
    const form = reactive({
      email: '',
      password: ''
    });
    const router = useRouter();

    const submit = async () => {
      await axios.post('login', {
        email: form.email,
        password: form.password
      }, {withCredentials: true});

      await router.push('/');
    }

    return {
      form,
      submit
    }
  }
}
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