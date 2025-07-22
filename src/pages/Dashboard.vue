<template>
  <main class="c-main">
    <div class="container-fluid">
      <div class="fade-in">

        <!-- SALES CHART -->
        <div class="row">
          <div class="col-md-8">
            <div class="card border-0 rounded-3 shadow border-top-purple">
              <div class="card-header">
                <span class="font-weight-bold"><i class="fa fa-chart-bar"></i> SALES CHART 7 DAYS</span>
              </div>
              <div class="card-body">
                <BarChart v-if="chartSellWeek" :chartData="chartSellWeek" :options="options" />
              </div>
            </div>
          </div>

          <!-- SALES & PROFIT TODAY -->
          <div class="col-md-4">
            <div class="card border-0 rounded-3 shadow border-top-info mb-4">
              <div class="card-header">
                <span class="font-weight-bold"><i class="fa fa-chart-line"></i> SALES TODAY</span>
              </div>
              <div class="card-body">
                <strong>{{ dashboard.count_sales_today }}</strong> SALES
                <hr />
                <h5 class="fw-bold">Rp. {{ formatPrice(dashboard.sum_sales_today) }}</h5>
              </div>
            </div>

            <div class="card border-0 rounded-3 shadow border-top-success">
              <div class="card-header">
                <span class="font-weight-bold"><i class="fa fa-chart-bar"></i> PROFITS TODAY</span>
              </div>
              <div class="card-body">
                <h5 class="fw-bold">Rp. {{ formatPrice(dashboard.sum_profits_today) }}</h5>
              </div>
            </div>
          </div>
        </div>

        <!-- BEST SELLING & STOCK LIMIT -->
        <div class="row">
          <div class="col-md-6">
            <div class="card border-0 rounded-3 shadow border-top-warning">
              <div class="card-header">
                <span class="font-weight-bold"><i class="fa fa-chart-pie"></i> BEST SELLING PRODUCT</span>
              </div>
              <div class="card-body">
                <DoughnutChart v-if="chartBestProduct" :chartData="chartBestProduct" />
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card border-0 rounded-3 shadow border-top-danger">
              <div class="card-header">
                <span class="font-weight-bold"><i class="fa fa-box-open"></i> PRODUCT STOCK</span>
              </div>
              <div class="card-body">
                <div v-if="dashboard.products_limit_stock.length > 0">
                  <ol class="list-group list-group-numbered">
                    <li v-for="product in dashboard.products_limit_stock" :key="product.id" class="list-group-item d-flex justify-content-between align-items-start">
                      <div class="ms-2 me-auto">
                        <div class="fw-bold">{{ product.title }}</div>
                      </div>
                      <span class="badge bg-danger rounded-pill">{{ product.stock }}</span>
                    </li>
                  </ol>
                </div>
                <div v-else class="alert alert-danger border-0 shadow rounded-3">
                  Data Tidak Tersedia!
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { BarChart, DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: "App",
  components: {
    BarChart,
    DoughnutChart
  },

  setup() {
    const dashboard = ref({
      count_sales_today: 0,
      sum_sales_today: 0,
      sum_profits_today: 0,
      sales_date: [],
      grand_total: [],
      product: [],
      total: [],
      products_limit_stock: []
    });

    const chartSellWeek = ref(null);
    const chartBestProduct = ref(null);

    const options = ref({
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
      }
    });

    const formatPrice = (value) => {
      return value.toLocaleString("id-ID");
    };

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const randomBackgroundColor = (length) => {
      return Array.from({ length }, () => getRandomColor());
    };

    const fetchDashboard = async () => {
      try {
        const response = await axios.get('');
        const data = response.data.data;
        dashboard.value = data;

        chartSellWeek.value = {
          labels: data.sales_date,
          datasets: [{
            data: data.grand_total,
            backgroundColor: randomBackgroundColor(data.sales_date.length),
          }]
        };

        chartBestProduct.value = {
          labels: data.product,
          datasets: [{
            data: data.total,
            backgroundColor: randomBackgroundColor(data.product.length),
          }]
        };

      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    onMounted(() => {
      fetchDashboard();
    });

    return {
      dashboard,
      chartSellWeek,
      chartBestProduct,
      formatPrice,
      options
    };
  }
}
</script>
