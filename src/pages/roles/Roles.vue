<template>
  <h1 class="h3 mb-3 fw-normal">Table Roles</h1>
  <div class="pt-3 pb-3 mb-3 border-bottom">
    <router-link to="/roles/create" class="btn btn-sm btn-outline-secondary">Add</router-link>
  </div>

  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th>No</th>
        <th>ID</th>
        <th>Name</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(role, index) in roles" :key="role.id">
        <td>{{ index + 1 }}</td>
        <td>{{ role.id }}</td>
        <td>{{ role.name }}</td>
        <td>
          <div class="btn-group mr-2">
            <router-link :to="`/roles/${role.id}/edit`" class="btn btn-sm btn-primary">Edit</router-link>
            <button class="btn btn-sm btn-danger ms-1" @click="deleteRole(role.id)">Delete</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {ref, onMounted} from "vue";
import axios from "axios";

interface Role {
  id: number;
  name: string;
}

export default {
  name: "RolesList",
  setup() {
    const roles = ref<Role[]>([]);

    const loadRoles = async () => {
      try {
        const {data} = await axios.get('roles');
        roles.value = data.Data;
      } catch (error) {
        console.error("Error fetching roles:", error);
        alert("Failed to load roles");
      }
    };

    const deleteRole = async (id: number) => {
      if (!confirm('Are you sure you want to delete this role?')) return;

      try {
        await axios.delete(`roles/${id}`);
        roles.value = roles.value.filter(role => role.id !== id);
        alert("Role deleted successfully");
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }

    onMounted(() => {
      loadRoles();
    });

    return {
      roles,
      deleteRole
    }
  }
}
</script>

<style scoped>

</style>