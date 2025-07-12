<template>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="#">Vue And Go Management</a>

    <nav class="my-2 my-md-0 mr-md-3">
      <router-link to="/profile" class="p-2 text-white text-decoration-none">{{ name }}</router-link>
      <router-link to="/login" class="p-2 text-white text-decoration-none" @click="logout">Sign out</router-link>
    </nav>
  </header>
</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

export default {
  name: "App",
  setup() {
    const name = ref('');

    onMounted(async () => {
      try {
        const {data} = await axios.get('user');

        if (data.Data) {
          name.value = data.Data.first_name + ' ' + data.Data.last_name;
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    });

    const logout = async () => {
      await axios.post('logout');
    }

    return {
      name,
      logout
    }
  }
}
</script>
