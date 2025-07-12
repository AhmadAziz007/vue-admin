<template>
  <form @submit.prevent="submit" enctype="multipart/form-data">
    <h1 class="h3 mb-3 fw-normal">Add New Product</h1>

    <div class="mb-3">
      <label for="image" class="form-label">
        Upload
        <img :src="imagePreview" alt="Preview" class="preview-image" />
      </label>
      <input
          type="file"
          class="form-control"
          id="image"
          accept="image/*"
          @change="handleFileChange"
          required
      >
    </div>

    <div class="mb-3">
      <label for="title" class="form-label">Title</label>
      <input v-model="formData.title" type="text" class="form-control" id="title" required>
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea v-model="formData.description" class="form-control" id="description" rows="3" required></textarea>
    </div>

    <div class="mb-3">
      <label for="price" class="form-label">Stock</label>
      <input v-model="formData.stock" type="number" class="form-control" id="stock" min="0" step="0.01" required>
    </div>

    <div class="mb-3">
      <label for="price" class="form-label">Price</label>
      <input v-model="formData.price" type="number" class="form-control" id="price" min="0" step="0.01" required>
    </div>

    <div class="mb-3">
      <label for="sell_price" class="form-label">Sell Price</label>
      <input v-model="formData.sell_price" type="number" class="form-control" id="sell_price" min="0" step="0.01" required>
    </div>

    <button type="submit" class="btn btn-primary">Save</button>
  </form>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

import uploadPlaceholder from "@/assets/upload.jpg";

export default {
  name: "App",
  setup() {
    const router = useRouter();
    const formData = reactive({
      title: '',
      description: '',
      price: 0,
      sell_price: 0,
      stock: 0,
      file: null as File | null
    });

    const imagePreview = ref(uploadPlaceholder);
    const isLoading = ref(false);

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        formData.file = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    const submit = async () => {
      isLoading.value = true;
      try {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('stock', formData.stock.toString());
        form.append('price', formData.price.toString());
        form.append('sell_price', formData.sell_price.toString());

        if (formData.file) {
          form.append('img_url', formData.file);
        }

        await axios.post('products', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        await router.push({
          path: '/products',
          query: { success: 'Product created successfully!' }
        });
      } catch (error) {
        console.error('Error creating product:', error);
        alert('Failed to create product. Please try again.');
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      imagePreview,
      isLoading,
      handleFileChange,
      submit
    };
  }
};
</script>

<style scoped>

.preview-image {
  display: block;
  margin-top: 8px;
  width: 200px;
  height: 200px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
}

input[type="file"] {
  display: none;
}
</style>