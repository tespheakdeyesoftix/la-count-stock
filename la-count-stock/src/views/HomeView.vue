 
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
              <p>Total Product: {{ d.total_item }}</p>
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
import { getApi,postApi } from '@/utils';
import { onMounted,ref,inject } from 'vue';

const countProduct = inject('$countProduct')
const data = ref([])
const auth = inject('$auth')
  onMounted (()=>{

    getApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_pending_stock_count").then(r=>{
      data.value = r.message
    })

  })
  function ReconcilationClick(d){
    d.items=[]
    if (localStorage.getItem(d.name)){
      let exist_data  = JSON.parse(localStorage.getItem(d.name)) 
      if (exist_data){
        exist_data.set_warehouse = d.set_warehouse
      }
      
      localStorage.setItem(d.name,JSON.stringify(exist_data))
    }else{
      localStorage.setItem(d.name,JSON.stringify(d))
    }
    
    
    countProduct.stockReconcil = d
    router.push({
              name: `count-product`,
              params: { name : d.name},
            })
  }
</script>
