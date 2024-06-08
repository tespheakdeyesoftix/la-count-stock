<template>


  <div class="wrapper">
    <nav class="navbar">
      <div class="container">
        <ul class="nav-left">
          <li>
            <div style="display: flex;align-items: center;">
              <button class="btn" style="margin-top:5px;" @click="visible = true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round"></path>
                </svg>
              </button>
              LA Sievphov
            </div>

          </li>

        </ul>
        <ul class="nav-right">
          <li>

            <div @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" class="profile">
              <div>
                <img src="https://www.pngkey.com/png/detail/115-1150152_default-profile-picture-avatar-png-green.png"
                  alt="Profile Picture" class="profile-pic">
              </div>
              <div class="username">
                <div class="font-bold" v-if="auth.user" style="font-weight:500">
                  {{ auth.user?.full_name }}
                </div>
                <div style="font-size:12px;margin-top: 4px;color: #7a7a7a">
                  {{ auth.user?.role_profile }}

                </div>
              </div>
            </div>
            <Menu ref="menu" id="overlay_tmenu" :popup="true" style="min-width: 180px;">
              <template #end>
                <Button label="Log Out" @click="logout" style="width:100%" icon="pi pi-sign-out" severity="danger"
                  outlined></Button>

              </template>
            </Menu>

          </li>

        </ul>
      </div>
    </nav>
    <Sidebar v-model:visible="visible" header="Menu">
      <Menu>
        <template #end>

          <button class="btn-menu">
            <span class="flex">Stock Reconcillation List</span>
          </button>
          <button class="btn-menu">
            <span class="flex">Stock Reconcillation</span>
          </button>
        </template>
      </Menu>
      <Button  @click="logout"  class="w-full btn-logout">Log Out</Button>
    </Sidebar>
    <div class="main">
      <RouterView />
    </div>

  </div>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { onMounted, ref, inject } from 'vue';
import router from '@/router';
const visible = ref(false);
const menu = ref();
const auth = inject('$auth')
const toggle = (event) => {
  menu.value.toggle(event);
};
function logout() {
  localStorage.removeItem("_authentication")
  location.reload();
}
</script>
<style scoped>
@media screen and (max-width: 800px) {

  .main {
    margin-top: 60px;
  }

}

.w-full {
  width: 100%;
}

.text-red {
  color: rgb(249, 108, 108);
}

.btn-logout {
  background: rgb(249, 108, 108);
  color: white;
  border: 0;
  display: flex;
  text-align: center;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
}

.btn {
  border: 0;
  background: none;
  cursor: pointer;
}

.btn-close {
  border: 0;
  background: none;
  position: absolute;
  right: 0;
  top: 3px;
  cursor: pointer;
}

.navbar {
  background-color: #F0F0F0;
  /* Adjust background color */
  padding: 10px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.container {
  display: flex;
  /* Flexbox for side-by-side elements */
  justify-content: space-between;
  /* Align items to opposite ends */
}

.nav-left,
.nav-right {
  list-style: none;
  /* Remove default list styling */
  padding: 0;
  /* Remove default padding */
  margin: 0;
  /* Remove default margin */
}

.profile-pic {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  /* Make image circular */
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  margin-left: 10px;
  display: flex;
  line-height: 1;
  flex-direction: column;
  text-align: left;
}

.profile {
  display: flex;
}

.btn-menu {
  padding: 10px 20px;
  background: none;
  width: 100%;
  border: 0;
  text-align: left;
  display: flex;
  cursor: pointer;
}
</style>
