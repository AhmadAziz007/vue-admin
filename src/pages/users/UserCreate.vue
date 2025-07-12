<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Add New User</h1>

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
import {useRouter} from 'vue-router';

interface Role {
  id: number;
  name: string;
}

export default {
  name: "UserCreate",
  setup() {
    const router = useRouter();

    const form = reactive({
      first_name: '',
      last_name: '',
      email: '',
      role_id: '' as string | number
    });

    const roles = ref<Role[]>([]);

    onMounted(async () => {
      try {
        const {data} = await axios.get('roles');
        roles.value = data.Data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    });

    const submit = async () => {
      try {
        const response = await axios.post('users', {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          role_id: form.role_id
        });

        console.log("User created:", response.data);

        await router.push('/users');
        alert("User create successfuly");
      } catch (error: any) {
        console.error("Error creating user:", error);

        if (error.response?.data?.Data?.error) {
          alert(error.response.data.Data.error);
        } else {
          alert("Failed to create user. Please try again.");
        }
      }
    }

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