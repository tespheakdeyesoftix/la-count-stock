 
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
const data = ref([])

  onMounted (()=>{

    getApi("api/method/epos_restaurant_2023.api.la_stock.get_pending_stock_count").then(r=>{
      data.value = r.message
    })
  })
  function test(){
    router.push({
              name: 'test'
            })
  }
  function ReconcilationClick(d){
    d.items=[]
    localStorage.setItem('selected_warehouse',JSON.stringify(d))
    countProduct.stockReconcil = d
    router.push({
              name: 'count-product'
            })
  }
</script>