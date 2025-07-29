<template>
  <nav
      id="sidebarMenu"
      class="col-md-3 col-lg-2 d-md-block bg-white border-end vh-100 sidebar collapse shadow-sm"
  >
    <div class="position-sticky pt-4">
      <h5 class="text-center mb-4 fw-bold">Admin Panel</h5>
      <ul class="nav flex-column px-3">
        <li
            class="nav-item mb-2"
            v-for="item in menuItems"
            :key="item.name"
        >
          <router-link
              :to="item.to"
              class="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded text-dark fw-medium"
              active-class="active"
          >
            <i :class="item.icon" style="font-size: 1.2rem;"></i>
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      menuItems: [
        { name: "Dashboard", to: "/", icon: "bi bi-speedometer2" },
        { name: "Users", to: "/users", icon: "bi bi-people" },
        { name: "Roles", to: "/roles", icon: "bi bi-person-gear" },
        { name: "Customers", to: "/customers", icon: "bi bi-people" },
        { name: "Products", to: "/products", icon: "bi bi-box" },
        { name: "Transactions", to: "/transactions", icon: "bi bi-cash-stack" },
        { name: "Sales", to: "/sales", icon: "bi bi-cash-stack" },
        { name: "Profit", to: "/profit", icon: "bi bi-cash-stack" },
      ],
    };
  },
};
</script>

<style scoped>
.bi bi-people {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}

.nav-link:hover,
.nav-link.active {
  background-color: #f8f9fa;
  color: #0d6efd !important;
  font-weight: 600;
}

.nav-link i {
  color: #6c757d;
}

.nav-link.active i {
  color: #0d6efd;
}
</style>
