<template>
  <main class="c-main">
    <div class="container-fluid">
      <div class="fade-in">
        <div class="row">
          <div class="col-md-4">
            <div class="card border-0 rounded-3 shadow">
              <div class="card-body">
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="fa fa-barcode"></i></span>
                  <input type="text" class="form-control" v-model="state.barcode"
                         @keyup.enter="searchProduct"
                         placeholder="Scan or Input Barcode">
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Product Name</label>
                  <input type="text" class="form-control" :value="state.product?.title || ''" placeholder="Product Name"
                         readonly>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Qty</label>
                  <input type="number" class="form-control text-center" v-model="state.qty" placeholder="Qty" min="1">
                </div>

                <div class="text-end">
                  <button @click.prevent="clearSearch"
                          class="btn btn-warning btn-md border-0 shadow text-uppercase me-2"
                          :disabled="!state.product?.id">CLEAR
                  </button>
                  <button @click.prevent="addToCart" class="btn btn-success btn-md border-0 shadow text-uppercase"
                          :disabled="!state.product?.id">ADD ITEM
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">

            <div v-if="session.error" class="alert alert-danger">
              {{ session.error }}
            </div>

            <div v-if="session.success" class="alert alert-success">
              {{ session.success }}
            </div>

            <div class="card border-0 rounded-3 shadow border-top-success">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 col-4">
                    <h4 class="fw-bold">GRAND TOTAL</h4>
                  </div>
                  <div class="col-md-8 col-8 text-end">
                    <h4 class="fw-bold">Rp. {{ formatPrice(state.grandTotal) }}</h4>
                    <div v-if="state.change > 0">
                      <hr>
                      <h5 class="text-success">Change : <strong>Rp. {{ formatPrice(state.change) }}</strong></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card border-0 rounded-3 shadow">
              <div class="card-body">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="fw-bold">Cashier</label>
                    <input class="form-control" type="text" :value="auth?.user?.name" readonly>
                  </div>
                  <div class="col-md-6">
                    <label class="fw-bold">Customer</label>
                    <VueMultiselect
                        v-model="state.selectedCustomer"
                        :options="customers"
                        :custom-label="customerFormat"
                        placeholder="Pilih Customer"
                        :searchable="true"
                        :show-labels="false"
                        max-height="200"
                    >
                      <template #option="{ option }">
                        <div class="d-flex justify-content-between">
                          <span>{{ option.id }} | {{ option.name }}</span>
                        </div>
                      </template>
                    </VueMultiselect>
                  </div>
                </div>

                <hr>

                <table class="table table-bordered">
                  <thead>
                  <tr style="background-color: #e6e6e7;">
                    <th scope="col">#</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Sub Total</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(cart) in state.carts" :key="cart.id">
                    <td class="text-center">
                      <button @click.prevent="destroyCart(cart.id)"
                              class="btn btn-danger btn-sm rounded-pill">
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                    <td>{{ cart.product?.title || 'N/A' }}</td>
                    <td>Rp. {{ formatPrice(cart.price) }}</td>
                    <td class="text-center">{{ cart.qty }}</td>
                    <td class="text-end">Rp. {{ formatPrice(cart.price * cart.qty) }}</td>
                  </tr>
                  <tr class="table-secondary">
                    <td colspan="4" class="text-end fw-bold">TOTAL</td>
                    <td class="text-end fw-bold">Rp. {{ formatPrice(state.carts_total) }}</td>
                  </tr>
                  </tbody>
                </table>

                <hr>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="fw-bold">Discount %</label>
                      <input type="number" v-model="state.discount" @input="setDiscount"
                             class="form-control" placeholder="Discount" min="0" max="100">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="fw-bold">Pay (Rp.)</label>
                      <input type="number" v-model="state.cash" @input="setChange"
                             class="form-control" placeholder="Pay amount" min="0">
                    </div>
                  </div>
                </div>

                <div class="text-end mt-4">
                  <button @click.prevent="clearAll"
                          class="btn btn-warning btn-md border-0 shadow text-uppercase me-2">
                    CANCEL
                  </button>
                  <button @click.prevent="payOrder"
                          class="btn btn-purple btn-md border-0 shadow text-uppercase"
                          :disabled="state.cash < state.grandTotal || state.grandTotal === 0">
                    PAY ORDER & PRINT
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {reactive, onMounted, defineComponent, ref, computed} from 'vue';
import axios, {AxiosError} from 'axios';
import {Product} from '@/models/product';
import {Cart} from '@/models/cart';
import {Customer} from '@/models/customer';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

interface State {
  barcode: string;
  product: Product | null;
  qty: number;
  discount: number;
  cash: number;
  change: number;
  selectedCustomer: Customer | null;
  carts: Cart[];
  carts_total: number;
  grandTotal: number;
}

export default defineComponent({
  name: 'TransactionPage',
  components: {
    VueMultiselect
  },
  props: {
    session: {
      type: Object as () => ({ error?: string; success?: string }),
      default: () => ({})
    },
    auth: {
      type: Object as () => ({ user?: { name: string } }),
      default: () => ({user: {name: 'Cashier'}})
    }
  },

  setup() {
    const state = reactive<State>({
      barcode: '',
      product: null,
      qty: 1,
      discount: 0,
      cash: 0,
      change: 0,
      selectedCustomer: null as Customer | null,
      carts: [],
      carts_total: 0,
      grandTotal: 0
    });
    const loadCart = async (): Promise<void> => {
      try {
        const response = await axios.get('/transactions/getCart');
        if (response.data.success) {
          state.carts = response.data.data.carts;
          state.carts_total = response.data.data.total;
          calculateGrandTotal();
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    const customers = ref<Customer[]>([]);

    const loadCustomers = async (): Promise<void> => {
      try {
        const response = await axios.get('dropdown/customers');
        customers.value = response.data.map((emp: any) => ({
          id: emp.id,
          name: emp.name,
        }));
      } catch (error) {
        console.error('Error fetching customers:', error);
        customers.value = [];
      }
    };

    const customerFormat = (customer: Customer) => {
      return `${customer.id} | ${customer.name}`;
    };

    const searchProduct = async (): Promise<void> => {
      if (!state.barcode.trim()) return;

      try {
        const response = await axios.get('/transactions/searchProduct', {
          params: {barcode: state.barcode}
        });

        if (response.data.success) {
          state.product = response.data.data;
        } else {
          state.product = null;
        }
      } catch (error) {
        state.product = null;
        console.error('Error searching product:', error);
      }
    };

    const clearSearch = (): void => {
      state.product = null;
      state.barcode = '';
    };

    const addToCart = async (): Promise<void> => {
      if (!state.product) return;

      try {
        await axios.post('/transactions/addToCart', {
          product_id: state.product.id,
          qty: state.qty
        });

        clearSearch();
        state.qty = 1;
        await loadCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };

    const destroyCart = async (cart_id: number): Promise<void> => {
      try {
        await axios.delete('/transactions/destroyCart', {
          data: {cart_id}
        });
        await loadCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    };

    const calculateGrandTotal = (): void => {
      // Calculate discount amount
      const discountAmount = state.carts_total * (state.discount / 100);
      state.grandTotal = state.carts_total - discountAmount;

      // Recalculate change
      setChange();
    };

    const setDiscount = (): void => {
      // Ensure discount is between 0-100
      state.discount = Math.min(100, Math.max(0, state.discount));
      calculateGrandTotal();
    };

    const setChange = (): void => {
      state.change = state.cash - state.grandTotal;
    };

    const payOrder = async (): Promise<void> => {
      if (state.cash < state.grandTotal) {
        alert('Cash amount is insufficient');
        return;
      }

      try {
        const response = await axios.post('/transactions/payOrder', {
          customer_id: state.selectedCustomer?.id || null,
          discount: state.discount,
          cash: state.cash
        });

        if (response.data.success) {
          // Reset state
          state.carts = [];
          state.carts_total = 0;
          state.grandTotal = 0;
          state.discount = 0;
          state.cash = 0;
          state.change = 0;
          state.selectedCustomer = null;
          clearSearch();

          alert('Transaction completed successfully!');
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        let message = 'Payment failed';

        if (err.response?.data?.message) {
          message = `${message}: ${err.response.data.message}`;
        } else if (err.message) {
          message = `${message}: ${err.message}`;
        }

        alert(message);
      }
    };

    const clearAll = (): void => {
      state.carts = [];
      state.carts_total = 0;
      state.grandTotal = 0;
      state.discount = 0;
      state.cash = 0;
      state.change = 0;
      state.selectedCustomer = null;
      clearSearch();
    };

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('id-ID').format(price);
    };

    onMounted(() => {
      document.title = 'Transactions - Aplikasi Kasir';
      loadCart();
      loadCustomers();
    });

    return {
      state,
      searchProduct,
      clearSearch,
      addToCart,
      destroyCart,
      setDiscount,
      setChange,
      payOrder,
      clearAll,
      formatPrice,
      customers,
      customerFormat
    };
  }
});
</script>

<style scoped>
.btn-purple {
  background-color: #6f42c1;
  color: white;
}

.vue-multiselect__content-wrapper {
  overflow-y: auto !important;
  max-height: 300px !important;
}

.vue-multiselect__option {
  padding: 8px 12px;
  white-space: normal !important; /* Pastikan teks tidak terpotong */
}
</style>