<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Edit Role</h1>

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
          <input class="form-check-input" type="checkbox" :value="permission.id"
                 :checked="checked(permission.id)"
                 @change="select(permission.id, $event.target.checked)">
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
import {useRoute, useRouter} from "vue-router";

interface Permission {
  id: number,
  name: string,
}

export default {
  name: "RolesEdit",
  setup() {
    const {push} = useRouter();
    const {params} = useRoute();

    const formData = reactive({
      name: '',
      permissions: [] as number[]
    });
    const permissionList = ref([]);

    onMounted(async () => {
      try {
        const {data} = await axios.get('permissions')
        permissionList.value = data;

        const response = await axios.get(`roles/${params.id}`);
        // PERBAIKAN: Akses Data dari respons
        formData.name = response.data.Data.name;
        formData.permissions = response.data.Data.permissions.map((p: Permission) => p.id);

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

    const checked = (id: number) => formData.permissions.some(p => p === id)

    const submit = async () => {
      try {
        // PERBAIKAN: Gunakan PUT dan endpoint yang benar
        const response = await axios.put(`roles/${params.id}`, {
          name: formData.name,
          permissions: formData.permissions.map(String) // Konversi ke string
        });

        console.log("Role updated:", response.data);

        await push('/roles');
        alert('Role updated successfully'); // Pesan sukses diperbaiki
      } catch (error: any) {
        console.error("Error updating role:", error);

        if (error.response?.data?.Data?.error) {
          alert(error.response.data.Data.error);
        } else {
          alert("Failed to update role. Please try again.");
        }
      }
    }

    return {
      formData,
      permissionList,
      submit,
      select,
      checked
    }
  }
}
</script>
