import Dashboard from '@/pages/Dashboard.vue'
import Users from '@/pages/users/Users.vue'
import UserCreate from '@/pages/users/UserCreate.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'
import Wrapper from '@/pages/Wrapper.vue'
import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import UserEdit from "@/pages/users/UserEdit.vue";
import Roles from "@/pages/roles/Roles.vue";
import RolesEdit from "@/pages/roles/RolesEdit.vue";
import RolesCreate from "@/pages/roles/RolesCreate.vue";
import Products from "@/pages/products/Products.vue";
import ProductCreate from "@/pages/products/ProductCreate.vue";
import ProductEdit from "@/pages/products/ProductEdit.vue";
import Transactions from "@/pages/transactions/Transactions.vue";
import Customers from "@/pages/customers/Customers.vue";
import CustomersCreate from "@/pages/customers/CustomerCreate.vue";
import CustomersEdit from "@/pages/customers/CustomerEdit.vue";

const routes: Array<RouteRecordRaw> = [
  {path: '/register', component: Register},
  {path: '/login', component: Login},
  {
    path: '',
    component: Wrapper,
    children: [
      {path: '', component: Dashboard},
      {path: '/users', component: Users},
      {path: '/profile', component: Profile},
      {path: '/users/create', component: UserCreate},
      {path: '/users/:id/edit', component: UserEdit, name: 'UserEdit'},
      {path: '/roles', component: Roles},
      {path: '/roles/create', component: RolesCreate},
      {path: '/roles/:id/edit', component:RolesEdit, name: 'RoleEdit'},
      {path: '/customers', component: Customers},
      {path: '/customers/create', component: CustomersCreate},
      {path: '/customers/:id/edit', component: CustomersEdit},
      {path: '/products', component: Products},
      {path: '/products/create', component:ProductCreate},
      {path: '/products/:id/edit', component:ProductEdit},
      {path: '/transactions', component:Transactions}
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
