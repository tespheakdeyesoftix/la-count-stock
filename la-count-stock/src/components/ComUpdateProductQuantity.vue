<template >
  <div>
    <table style="width: 100%;">
      <tr>
      <th>
         Product Name
      </th>
      <th>
        {{ product.item_name }}
      </th>
      </tr>
      <tr>
        <th>
          Qty on hand
        </th>
        <th>
          {{ product.actual_qty }}
        </th>
      </tr>
      <tr>
        <th>
          Stock 
        </th>
        <th>
          {{ product.stock_uom }}
        </th>
      </tr>
    </table>
    <div class="product-qty-wrapper" style="margin-top: 10px;width: 100%;"><InputNumber class="w-full" v-model="product.qty" /></div>
    <Button class="p-button" @click="save">Save</Button>
  </div>
</template>
<script setup>
  import {ref,inject,onMounted} from 'vue'
  import { useDialog } from 'primevue/usedialog';
  import InputNumber from 'primevue/inputnumber';
  import Button from 'primevue/button';
  const dialogRef = inject("dialogRef");
  const countProduct = inject('$countProduct')
  const dialog = useDialog();
  const product=ref(dialogRef.value.data.product)
  onMounted(()=>{
    const el = document.querySelector('.product-qty-wrapper input')
      el.focus()
    setTimeout(()=>{
      el.select()
    },200)
  })
  function save(){
    const exist_item = countProduct.stockReconcil.items.find((item) => item.item_code == product.value.item_code)
    if (exist_item){
      
      exist_item.qty = product.value.qty
    }else{
      countProduct.stockReconcil.items.push(product.value)
    }
    
    localStorage.setItem(countProduct.stockReconcil.name ,JSON.stringify(countProduct.stockReconcil))
    dialogRef.value.close(true)
  }

</script>
<style scoped>
  .p-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  margin-top: 5px;
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding:3px;
}
</style>