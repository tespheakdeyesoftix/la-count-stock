 
<template>
  <main>
{{ data }}
  </main>
</template>
<script setup>
  import { getApi } from '@/utils';
import { onMounted,ref } from 'vue';
const data = ref([])
  onMounted (()=>{
    alert(222)
    getApi("api/resource/Stock Reconciliation",{
      fields:["name","set_warehouse"],
      filters:[["docstatus", "=", 0]]
    }).then(r=>{
      
      data.value = r.data
    })
  })
</script>