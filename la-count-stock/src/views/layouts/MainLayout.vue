<template>


        <div class="wrapper">
          <nav class="navbar">
  <div class="container">
    <ul class="nav-left">
      <li>
        <div>
          <button class="btn" style="margin-top:5px;" @click="visible = true">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
</button>
      </div>
      
      </li>
      
      </ul>
    <ul class="nav-right">
      <li>
   
        <div @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" class="profile">
          <div>
          <img src="https://www.pngkey.com/png/detail/115-1150152_default-profile-picture-avatar-png-green.png" alt="Profile Picture" class="profile-pic">
        </div>
        <div class="username">
          <div>
         Admin
          </div>
          <div>
         Email
          </div>
        </div>
        </div>
        <Menu ref="show" id="overlay_tmenu" :popup="true" style="min-width: 180px;">
        <template #end>
           
            <button @click="onLogout"
                class="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround">
                <i class="font-bold pi pi-sign-out !text-red-500" />
                <span class="pl-2 pr-3 !text-red-500">{{$t("Log Out")}}</span>
            </button>
        </template>
    </Menu>
        
      </li>
    
    </ul>
  </div>
</nav>
<Sidebar v-model:visible="visible" header="Sidebar">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    </Sidebar>
    <div class="main">
       <RouterView />
    </div>
     
    </div>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from 'primevue/sidebar';
import OverlayPanel from 'primevue/overlaypanel';
import TieredMenu from 'primevue/tieredmenu'; 
import { onMounted,ref,inject } from 'vue';
const visible = ref(false);
const menu = ref();
const items = ref([
    {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        class:'red'
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};
</script>
<style scoped>
@media screen and (max-width: 800px) {

  .main{
    margin-top: 50px;
  }

}
.red{
  color: red;
}
.btn{
  border: 0;
  background:none;
  cursor: pointer;
}
.btn-close{
  border: 0;
    background: none;
    position: absolute;
    right: 0;
    top: 3px;
}

    .navbar {
  background-color: #F0F0F0; /* Adjust background color */
  padding: 10px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.container {
  display: flex; /* Flexbox for side-by-side elements */
  justify-content: space-between; /* Align items to opposite ends */
}

.nav-left, .nav-right {
  list-style: none; /* Remove default list styling */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
}

.profile-pic {
  width: 35px;
  height: 35px;
  border-radius: 50%; /* Make image circular */
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
.profile{
  display: flex;
}
</style>
