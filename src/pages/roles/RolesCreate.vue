<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Add New Role</h1>

    <div class="mb-3 mt-3 row">
      <label class="col-sm-2 col-form-label">Name</label>
      <div class="col-sm-10">
        <input v-model="formData.name" class="form-control" name="name">
      </div>
    </div>

    <div class="mb-3 row">
      <label class="col-sm-2 col-form-label">Permission</label>
      <div class="col-sm-10">
        <div class="form-check form-check-inline col-3" v-for="permission in permissionList" :key="permission.id">
          <input class="form-check-input" type="checkbox" :value="permission.id" @change="select(permission.id, $event.target.checked)">
          <label class="form-check-label">{{ permission.name }}</label>
        </div>
      </div>
    </div>
    <button class="btn btn-outline-secondary" type="submit">Save</button>
  </form>
</template>

<script lang="ts">
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

export default {
  name: "App",
  setup() {
    const {push} = useRouter();
    const formData = reactive({
      name: '',
      permissions: [] as number[]
    });
    const permissionList = ref([]);

    onMounted(async () => {
      try {
        const {data} = await axios.get('permissions')
        permissionList.value = data;
      } catch (error) {
        console.error("Error fetching permissions:", error)
      }
    });

    const select = (id: number, checked: boolean) => {
      if (checked) {
        formData.permissions = [...formData.permissions, id];
        return;
      }
      formData.permissions = formData.permissions.filter(p => p !== id);
    }

    const submit = async () => {
      try {
        const response = await axios.post('roles', {
          name: formData.name,
          permissions: formData.permissions
        });

        console.log("Role created:", response.data);

        await push('/roles');
        alert('Roles create succesfully');
      } catch (error: any) {
        console.error("Error creating role:", error);

        if (error.response?.data?.Data?.error) {
          alert(error.response.data.Data.error);
        } else {
          alert("Failed to create role. Please try again.");
        }
      }
    }

    return {
      formData,
      permissionList,
      submit,
      select
    }
  }
}
</script>

<style scoped>

</style>