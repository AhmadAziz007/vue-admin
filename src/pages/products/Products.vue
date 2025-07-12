<template>
  <h1 class="h3 mb-3 fw-normal">Table Products</h1>
  <div class="pt-3 pb-3 mb-3 border-bottom">
    <router-link to="/products/create" class="btn btn-sm btn-outline-secondary">Add</router-link>
  </div>

  <div class="table-responsive small">
    <table class="table table-striped table-sm">
      <thead>
      <tr>
        <th>No</th>
        <th>ID</th>
        <th>Barcode</th>
        <th>Title</th>
        <th>Description</th>
        <th>Stock</th>
        <th>Sell Price</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(product, index) in products" :key="product.id">
        <td>{{ getRowNumber(index) }}</td>
        <td>{{ product.id }}</td>
        <td>{{ product.barcode }}</td>
        <td>{{ product.title }}</td>
        <td>{{ product.description }}</td>
        <td>{{ product.stock }}</td>
        <td>{{ product.sell_price }}</td>
        <td>
          <router-link :to="`/products/${product.id}/edit`" class="btn btn-sm btn-primary">Edit</router-link>
          <button class="btn btn-sm btn-danger ms-1" @click="deleteProduct(product.id)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <nav v-if="lastPage > 1">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
        </li>

        <li
            v-for="page in lastPage"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === lastPage }">
          <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import {ref, onMounted} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

interface Product {
  id: number;
  barcode: string;
  title: string;
  description: string;
  img_url: string;
  stock: number;
  price: number;
  sell_price: number;
  created_at: string;
  updated_at: string;
}

interface Meta {
  limit: number;
  page: number;
  total: number;
}

export default {
  name: "ProductsView",
  setup() {
    const products = ref<Product[]>([]);
    const meta = ref<Meta>({
      limit: 5,
      page: 1,
      total: 0
    });

    const currentPage = ref(1);
    const lastPage = ref(1);

    const route = useRoute();
    const router = useRouter();

    const fetchProducts = async (page = 1) => {
      try {
        const {data} = await axios.get('products', {
          params: {page}
        });

        products.value = data.data;
        meta.value = data.meta;
        currentPage.value = data.meta.page;

        // Hitung last_page dari total dan limit
        lastPage.value = Math.ceil(data.meta.total / data.meta.limit);

        router.replace({query: {page}});
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const getRowNumber = (index: number) => {
      return (currentPage.value - 1) * meta.value.limit + index + 1;
    };

    const changePage = (page: number) => {
      if (page < 1 || page > lastPage.value) return;
      fetchProducts(page);
    };

    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      img.src = 'https://via.placeholder.com/60x60?text=Image+Error';
    };

    const deleteProduct = async (id: number) => {
      if (!confirm('Are you sure you want to delete this product?')) return;

      try {
        await axios.delete(`products/${id}`);

        fetchProducts(currentPage.value);
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    };

    onMounted(async () => {
      if (route.query.success) {
        alert(route.query.success);
        router.replace({ query: {} });
      }
      const page = parseInt(route.query.page as string) || 1;
      fetchProducts(page);
    });

    return {
      products,
      currentPage,
      lastPage,
      getRowNumber,
      changePage,
      handleImageError,
      deleteProduct
    };
  }
};
</script>