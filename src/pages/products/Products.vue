<template>
  <h1 class="h3 mb-3 fw-normal">Table Products</h1>
  <div class="pt-3 pb-3 mb-3 border-bottom d-flex align-items-center justify-content-between">
    <!-- Tombol Add di kanan -->
    <router-link to="/products/create" class="btn btn-sm btn-outline-secondary">Add</router-link>

    <!-- Search input di kiri -->
    <div class="d-inline-block">
      <div class="input-group input-group-sm" style="max-width: 250px;">
        <input
            type="text"
            class="form-control"
            placeholder="Search by title..."
            v-model="searchTitle"
        >
      </div>
    </div>
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

    <nav v-if="meta.last_page > 1">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: meta.page === 1 }">
          <button class="page-link" @click="changePage(meta.page - 1)">Previous</button>
        </li>

        <li
            v-for="page in lastPage"
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
import {ref, onMounted, watch} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import {Product} from "@/models/product";

interface Meta {
  last_page: number;
  page: number;
  total: number;
  limit: number;
}

interface ApiResponse {
  data: Product[];
  meta: Meta;
}

export default {
  name: "ProductsView",
  setup() {
    const products = ref<Product[]>([]);
    const meta = ref<Meta>({
      last_page: 1,
      page: 1,
      total: 0,
      limit: 5
    });

    const searchTitle = ref("");
    watch(searchTitle, (newTitle) => {
      fetchProducts(1);
    });
    const lastPage = ref(1);

    const route = useRoute();
    const router = useRouter();

    const fetchProducts = async (page = 1) => {
      try {
        const response = await axios.post(
            'products/search',
            {title: searchTitle.value},
            {
              params: {page}
            }
        );

        const data: ApiResponse = response.data;
        products.value = data.data;
        meta.value = data.meta;
        lastPage.value = data.meta.last_page;

        router.replace({query: {page}});
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products. Please try again.");
      }
    };

    const searchProducts = () => {
      fetchProducts(1);
    };

    const getRowNumber = (index: number) => {
      return (meta.value.page - 1) * meta.value.limit + index + 1;
    };

    const changePage = (page: number) => {
      if (page < 1 || page > lastPage.value) return;
      fetchProducts(page);
    };

    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      img.src = 'https://via.placeholder.com/60x60?text=Image+Error';
    };

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value);
    };

    const deleteProduct = async (id: number) => {
      if (!confirm('Are you sure you want to delete this product?')) return;

      try {
        await axios.delete(`products/${id}`);
        fetchProducts(meta.value.page);
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    };

    onMounted(async () => {
      if (route.query.success) {
        alert(route.query.success);
        router.replace({query: {}});
      }

      const page = parseInt(route.query.page as string) || 1;
      await fetchProducts(page);
    });

    return {
      products,
      meta,
      lastPage,
      searchTitle,
      getRowNumber,
      changePage,
      handleImageError,
      deleteProduct,
      searchProducts,
      formatCurrency
    };
  }
};
</script>
