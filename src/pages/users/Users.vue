<template>
  <h1 class="h3 mb-3 fw-normal">Table Users</h1>
  <div class="pt-3 pb-3 mb-3 border-bottom">
    <router-link to="/users/create" class="btn btn-sm btn-outline-secondary">Add</router-link>
  </div>

  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th>No</th>
        <th>ID USER</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
        <td>{{ getRowNumber(index) }}</td>
        <td>{{ user.id }}</td>
        <td>{{ user.first_name }} {{ user.last_name }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role?.name || 'N/A' }}</td>
        <td>
          <router-link :to="`/users/${user.id}/edit`" class="btn btn-sm btn-primary">Edit</router-link>
          <button class="btn btn-sm btn-danger ms-1" @click="deleteUser(user.id)">Delete</button>
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

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
}

export default {
  name: "App",
  setup() {
    const users = ref<User[]>([]);
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

    const fetchUsers = async (page = 1) => {
      try {
        const {data} = await axios.get('users', {
          params: {page}
        });

        users.value = data.Data;
        meta.value = data.Meta;
        currentPage.value = page;

        router.replace({query: {page}});
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const getRowNumber = (index: number) => {
      return (currentPage.value - 1) * perPage.value + index + 1;
    };

    const changePage = (page: number) => {
      if (page < 1 || page > meta.value.last_page) return;
      fetchUsers(page);
    };

    const deleteUser = async (id: number) => {
      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        await axios.delete(`users/${id}`);

        users.value = users.value.filter(user => user.id !== id);
        alert("User deleted successfuly");

        meta.value.total -= 1;

        if (users.value.length === 0 && currentPage.value > 1) {
          fetchUsers(currentPage.value - 1);
        }

      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    };

    onMounted(() => {
      fetchUsers(currentPage.value);
    });

    return {
      users,
      meta,
      getRowNumber,
      changePage,
      deleteUser,
    };
  }
};
</script>

