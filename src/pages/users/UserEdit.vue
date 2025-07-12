<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Edit User</h1>

    <div class="mb-3">
      <label>First Name</label>
      <input v-model="form.first_name" class="form-control" name="first_name" required>
    </div>

    <div class="mb-3">
      <label>Last Name</label>
      <input v-model="form.last_name" class="form-control" name="last_name" required>
    </div>

    <div class="mb-3">
      <label>Email</label>
      <input v-model="form.email" type="email" class="form-control" name="email" required>
    </div>

    <div class="mb-3">
      <label>Role</label>
      <select v-model="form.role_id" class="form-control" name="role_id" required>
        <option value="" disabled selected>Select Role</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
    </div>

    <button class="btn btn-outline-secondary" type="submit">Save</button>
  </form>
</template>

<script lang="ts">
import {onMounted, reactive, ref} from "vue";
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
}

export default {
  name: "App",
  setup() {
    const router = useRouter();
    const roles = ref<Role[]>([]);
    const route = useRoute();

    const form = reactive({
      id: 0,
      first_name: '',
      last_name: '',
      email: '',
      role_id: '' as string | number
    });

    const loadUserData = async () => {
      try {
        const userId = route.params.id;
        const userResponse = await axios.get(`users/${userId}`);
        const userData: User = userResponse.data.Data;

        form.id = userData.id;
        form.first_name = userData.first_name;
        form.last_name = userData.last_name;
        form.email = userData.email;
        form.role_id = userData.role_id;

        const rolesResponse = await axios.get('roles');
        roles.value = rolesResponse.data.Data;

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load user data");
      }
    };

    const submit = async () => {
      try {
        await axios.put(`users/${form.id}`, {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          role_id: form.role_id
        });

        await router.push('/users');
        alert("Edit User Successfully")
      } catch (error: any) {
        console.error("Error updating user:", error);

        if (error.response?.data?.Data?.error) {
          alert(error.response.data.Data.error);
        } else {
          alert("Failed to update user. Please try again.");
        }
      }
    }

    onMounted(() => {
      loadUserData();
    });

    return {
      form,
      roles,
      submit
    }
  }
}
</script>

<style scoped>

</style>