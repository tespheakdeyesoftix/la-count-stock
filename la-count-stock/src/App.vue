

<template>
  <ConfirmDialog></ConfirmDialog>
  <Toast />
  <DynamicDialog />
  <header>
    <MainLayout v-if="auth.isLoggedIn==1"/>
		
		<BlankLayout v-else/>

  </header>


</template>
<script setup>
import {inject} from 'vue'
import DynamicDialog from 'primevue/dynamicdialog';
import router from '@/router';
import { RouterLink, RouterView } from 'vue-router'
import ConfirmDialog from 'primevue/confirmdialog';
import {onMounted, onUnmounted} from "vue"
import Toast from 'primevue/toast';
import MainLayout from '@/views/layouts/MainLayout.vue'
import BlankLayout from '@/views/layouts/BlankPayout.vue'

import { useToast } from "primevue/usetoast";
const toast = useToast();
const auth = inject('$auth')
 

const actionClickHandler = async function (e) {

  if (e.isTrusted ) {
    if(e.data.message){
      toast.add({ severity: 'error', summary: e.data.message, life: 3000 });
    }
  }
}
onUnmounted(() => {
    window.removeEventListener('message', actionClickHandler, false);
   
})
onMounted(() => { 
     
    window.addEventListener('message', actionClickHandler, false);
})



</script>
<style scoped>
header {
  line-height: 1.5;
  /* max-height: 100vh; */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    /* padding-right: calc(var(--section-gap) / 2); */
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
