<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Add New Customer</h1>

    <div class="mb-3">
      <label>First Name</label>
      <input v-model="form.name" class="form-control" name="name" required>
    </div>

    <div class="mb-3">
      <label>Email</label>
      <input v-model="form.email" type="email" class="form-control" name="email" required>
    </div>

    <button class="btn btn-outline-secondary" type="submit">Save</button>
  </form>
</template>

<script lang="ts">
import {reactive} from "vue";
import axios from 'axios';
import {useRouter} from 'vue-router';

export default {
  name: "CustomerCreate",
  setup() {
    const router = useRouter();

    const form = reactive({
      name: '',
      email: '',
    });

    const submit = async () => {
      try {
        const response = await axios.post('customers', {
          name: form.name,
          email: form.email
        });

        console.log("Customer created:", response.data);

        await router.push('/customers');
        alert("Customer create successfuly");
      } catch (error: any) {
        console.error("Error creating customer:", error);

        if (error.response?.data?.Data?.error) {
          alert(error.response.data.Data.error);
        } else {
          alert("Failed to create user. Please try again.");
        }
      }
    }

    return {
      form,
      submit
    }
  }
}
</script>

<style scoped>

</style>