<template>
  <main class="c-main">
    <div class="container-fluid">
      <div class="fade-in">
        <div class="row">
          <div class="col-md-12">
            <div class="card border-0 rounded-3 shadow border-top-purple">
              <div class="card-header">
                <span class="font-weight-bold"><i class="fa fa-chart-bar"></i> REPORT SALES</span>
              </div>
              <div class="card-body">
                <form @submit.prevent="filter">
                  <div class="row">
                    <div class="col-md-5">
                      <div class="mb-3">
                        <label class="form-label fw-bold">START DATE</label>
                        <input type="date" v-model="start_date" class="form-control">
                      </div>
                      <div v-if="errors.start_date" class="alert alert-danger">
                        {{ errors.start_date }}
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div class="mb-3">
                        <label class="form-label fw-bold">END DATE</label>
                        <input type="date" v-model="end_date" class="form-control">
                      </div>
                      <div v-if="errors.end_date" class="alert alert-danger">
                        {{ errors.end_date }}
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label fw-bold text-white">*</label>
                        <button class="btn btn-md btn-primary border-0 shadow w-100"><i class="fa fa-filter"></i> FILTER
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div v-if="sales">
                  <hr>
                  <div class="export text-end mb-3">
                    <button @click="exportExcel" class="btn btn-success btn-md border-0 shadow me-3">
                      <i class="fa fa-file-excel"></i> EXCEL
                    </button>
                    <button @click="exportPDF" class="btn btn-da btn-danger border-0 shadow">
                      <i class="fa fa-file-pdf"></i> PDF
                    </button>
                  </div>
                  <table class="table table-bordered">
                    <thead>
                    <tr style="background-color: #e6e6e7;">
                      <th scope="col">Date</th>
                      <th scope="col">Invoice</th>
                      <th scope="col">Cashier</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Discount</th>
                      <th scope="col">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="sale in sales" :key="sale.id">
                      <td>{{ sale.created_at }}</td>
                      <td class="text-center">{{ sale.invoice }}</td>
                      <td>
                        {{
                          sale.user
                              ? `${sale.user.first_name} ${sale.user.last_name}`
                              : 'Kasir Tidak Diketahui'
                        }}
                      </td>
                      <td>
                        {{
                          sale.customer
                              ? sale.customer.name
                              : 'Umum'
                        }}
                      </td>
                      <td class="text-center">{{ sale.discount }}</td>
                      <td class="text-end">Rp. {{ formatPrice(sale.grand_total) }}</td>
                    </tr>
                    <!-- Perbaikan di sini: -->
                    <tr>
                      <td colspan="4" class="text-end fw-bold" style="background-color: #e6e6e7;">TOTAL SALES</td>
                      <td class="text-center fw-bold" style="background-color: #e6e6e7;"></td>
                      <td class="text-end fw-bold" style="background-color: #e6e6e7;">Rp. {{ formatPrice(total) }}</td>
                    </tr>
                    </tbody>
                  </table>
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
import axios from 'axios'

export default {
  name: "App",
  data() {
    return {
      start_date: "",
      end_date: "",
      sales: [],
      total: 0,
      errors: {}
    }
  },
  methods: {
    async filter() {
      this.errors = {}
      try {
        const response = await axios.post("sales/filter", {
          start_date: this.start_date,
          end_date: this.end_date
        })

        this.sales = response.data.sales
        this.total = response.data.total
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errors = error.response.data.error || {}
        } else {
          alert("An error occurred while retrieving data.")
        }
      }
    },

    async exportExcel() {
      try {
        const response = await axios.post(
            "sales/export-excel",
            {
              start_date: this.start_date,
              end_date: this.end_date
            },
            {
              responseType: 'blob' // Penting untuk file biner
            }
        )

        // Buat URL dari blob
        const url = window.URL.createObjectURL(new Blob([response.data]))

        // Buat link untuk download
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `sales_report_${this.start_date}_to_${this.end_date}.xlsx`)
        document.body.appendChild(link)

        // Trigger download
        link.click()

        // Bersihkan
        link.remove()
        window.URL.revokeObjectURL(url)

      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("Please select valid dates")
        } else {
          alert("Failed to export Excel: " + error.message)
        }
      }
    },

    async exportPDF() {
      try {
        const response = await axios.post(
            "sales/export-pdf",
            {
              start_date: this.start_date,
              end_date: this.end_date
            },
            {
              responseType: 'blob'
            }
        )
        const url = window.URL.createObjectURL(new Blob([response.data]))

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `sales_report_${this.start_date}_to_${this.end_date}.pdf`)
        document.body.appendChild(link)

        link.click()

        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert("Please select valid dates")
        } else {
          alert("Failed to export PDF: " + error.message)
        }
      }
    },

    formatPrice(value) {
      if (!value) return '0'
      return parseFloat(value).toLocaleString('id-ID')
    }
  }
}
</script>

<style scoped>

</style>