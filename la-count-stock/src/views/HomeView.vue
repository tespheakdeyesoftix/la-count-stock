 
<template>
  <main>
   hello home
  </main>
</template>
<script setup>
  import { getApi } from '@/utils';
import { onMounted } from 'vue';
  onMounted (()=>{
    alert(222)
    getApi("api/resource/Customer").then(r=>{
      
      console.log(r.data)
    })
  })
</script>