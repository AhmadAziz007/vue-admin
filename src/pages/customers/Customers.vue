<template>
  <h1 class="h3 mb-3 fw-normal">Table Customers</h1>
  <div class="pt-3 pb-3 mb-3 border-bottom">
    <router-link to="/customers/create" class="btn btn-sm btn-outline-secondary">Add</router-link>
  </div>

  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th>No</th>
        <th>ID Customers</th>
        <th>Name</th>
        <th>Email</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(customer, index) in customers" :key="customer.id">
        <td>{{ getRowNumber(index) }}</td>
        <td>{{ customer.id }}</td>
        <td>{{ customer.name }}</td>
        <td>{{ customer.email }}</td>
        <td>
          <router-link :to="`/customers/${customer.id}/edit`" class="btn btn-sm btn-primary">Edit</router-link>
          <button class="btn btn-sm btn-danger ms-1" @click="deleteCustomer(customer.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <nav v-if="meta.last_page > 1">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: meta.page === 1 }">
          <button class="page-link" @click="changePage(meta.page - 1)">Previous</button>
        </li>

        <li
            v-for="page in meta.last_page"
            :key="page"
            class="page-item"
            :class="{ active: meta.page === page }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>

        <li class="page-item" :class="{ disabled: meta.page === meta.last_page }">
          <button class="page-link" @click="changePage(meta.page + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import {ref, onMounted, computed} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

interface Customer {
  id: number,
  name: string;
  email: string;
}

export default {
  name: "App",
  setup() {
    const customers = ref<Customer[]>([]);
    const meta = ref({
      last_page: 0,
      page: 1,
      total: 0
    });
    const route = useRoute();
    const router = useRouter();

    const currentPage = ref(parseInt(route.query.page as string) || 1);

    const perPage = computed(() => {
      if (!meta.value.total || !meta.value.last_page) return 5;
      return Math.ceil(meta.value.total / meta.value.last_page);
    });

    const fetchCustomers = async (page = 1) => {
      try {
        const {data} = await axios.get('customers', {
          params: {page}
        });

        customers.value = data.Data;
        meta.value = data.Meta;
        currentPage.value = page;

        router.replace({query: {page}});
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const getRowNumber = (index: number) => {
      return (currentPage.value - 1) * perPage.value + index + 1;
    };

    const changePage = (page: number) => {
      if (page < 1 || page > meta.value.last_page) return;
      fetchCustomers(page);
    };

    const deleteCustomer = async (id: number) => {
      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        await axios.delete(`customers/${id}`);
        customers.value = customers.value.filter(customer => customer.id !== id);
        alert("Customer deleted successfully");

        meta.value.total -= 1;

        if (customers.value.length === 0 && currentPage.value > 1) {
          fetchCustomers(currentPage.value -1);
        }
      } catch (error) {
        console.error("Error deleting customer:", Error);
        alert("Failed to delete customer. Please try again.");
      }
    };

    onMounted(() => {
      fetchCustomers(currentPage.value);
    });

    return {
      customers,
      meta,
      getRowNumber,
      changePage,
      deleteCustomer,
    };
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>