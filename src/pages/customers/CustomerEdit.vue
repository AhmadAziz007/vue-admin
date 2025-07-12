<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Edit Customer</h1>

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
import {onMounted, reactive} from "vue";
import axios from 'axios';
import {useRoute, useRouter} from 'vue-router';
import {Customer} from "../../models/customer";

export default {
  name: "CustomerEdit",
  setup() {
    const router = useRouter();
    const route = useRoute();

    const form = reactive({
      id: 0,
      name: '',
      email: ''
    });

    const loadCustomerData = async () => {
      try {
        const customerId = route.params.id;
        const customerResponse = await axios.get(`customers/${customerId}`);
        const customerData: Customer = customerResponse.data;

        form.id = customerData.id;
        form.name = customerData.name;
        form.email = customerData.email;

      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load customer data");
      }
    };

    const submit = async () => {
      try {
         await axios.put(`customers/${form.id}`, {
          name: form.name,
          email: form.email
        });

        await router.push('/customers');
        alert("Edit Customer successfuly");
      } catch (error: any) {
        console.error("Error creating customer:", error);

        if (error.response?.data?.Data?.error) {
          alert(error.response.data.Data.error);
        } else {
          alert("Failed to update customer. Please try again.");
        }
      }
    }

    onMounted(() => {
      loadCustomerData();
    });

    return {
      form,
      submit
    }
  }
}
</script>

<style scoped>

</style>