<template>
  <form @submit.prevent="submit" enctype="multipart/form-data">
    <h1 class="h3 mb-3 fw-normal">Edit Product</h1>

    <div class="mb-3">
      <label for="title" class="form-label">ID</label>
      <input v-model="formData.id" type="text" class="form-control" id="id" readonly>
    </div>

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
      >
    </div>

    <div class="mb-3">
      <label for="title" class="form-label">Barcode</label>
      <input v-model="formData.barcode" type="text" class="form-control" id="barcode" readonly>
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
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "EditProduct",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const id = route.params.id;

    const formData = reactive({
      id: '',
      barcode: '',
      title: '',
      description: '',
      stock: 0,
      price: 0,
      sell_price: 0,
      img_url: null as File | null,
    });

    const imagePreview = ref('');
    const isLoading = ref(false);

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        formData.img_url = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    onMounted(async () => {
      try {
        const response = await axios.get(`products/${id}`);
        const product = response.data;

        formData.id = product.id;
        formData.barcode = product.barcode;
        formData.title = product.title;
        formData.description = product.description;
        formData.stock = product.stock;
        formData.price = product.price;
        formData.sell_price = product.sell_price;

        // Tampilkan gambar dari image_data jika tersedia
        if (product.image_data) {
          imagePreview.value = `data:image/jpeg;base64,${product.image_data}`;
        } else if (product.img_url) {
          imagePreview.value = product.img_url;
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        alert("Failed to load product data.");
      }
    });

    const submit = async () => {
      isLoading.value = true;
      try {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('stock', formData.stock.toString());
        form.append('price', formData.price.toString());
        form.append('sell_price', formData.sell_price.toString());

        if (formData.img_url) {
          form.append('img_url', formData.img_url);
        }

        await axios.put(`products/${id}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        await router.push({
          path: '/products',
          query: { success: 'Product updated successfully!' }
        });
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product. Please try again.');
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