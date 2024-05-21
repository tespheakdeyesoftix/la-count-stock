 
<template>
  <main class="main-section">
    <h1>Inventory Count</h1>
    <template v-if="data.length > 0">
      <p>You have {{ data?.length }} pending stock Reconciliation Transaction</p>
      <p>Please select stock Reconciliation Number below:</p>
      <br/>
      <div class="d-cart-wrapper">
      <template  v-for="d in data">
          <button class="button-cus" @click="ReconcilationClick(d)">
            <p style="font-weight: 600;">{{ d.name }}<br/>
              {{ d.set_warehouse }}</p>
          </button>
      </template>
    </div>
    </template>
    <template v-else>
      <p>There is no stock Reconciliation Number. Please open stock Reconciliation Number first.</p>
    </template>  
  </main>
</template>
<script setup>
  import router from '@/router';
import { getApi } from '@/utils';

import { onMounted,ref,inject } from 'vue';
const countProduct = inject('$countProduct')
const data = ref([{'name':'MAT-RECO-2024-00171','set_warehouse':'BS01 - Watbo - LA'}])

  onMounted (()=>{

    // getApi("api/resource/Stock Reconciliation",{
    //   fields:["name","set_warehouse"],
    //   filters:[["docstatus", "=", 0]]
    // }).then(r=>{
      
    //   data.value = r.data
    // })
  })
  function ReconcilationClick(d){
    d.items=[]
    localStorage.setItem('selected_warehouse',JSON.stringify(d))
    countProduct.stockReconcil = d
    router.push({
              name: 'count-product'
            })
  }
</script>