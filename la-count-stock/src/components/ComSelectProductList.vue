<template lang="">
    <div style="width:100%">
    {{productList}}
    <div style="padding-top:8px;padding-bottom:8px;width:100%" class="flex">
        <DataView :value="productList">
            <template #list="slotProps">
               <div @click="callback(item)" v-for="(item, index) in slotProps.items" class="item">
                <div>
                    {{item.item_name}}
                </div>
                <div>
                    {{item.item_code}}
                </div>
                <div>
                      {{item.stock_uom}}
                </div>
              
               </div>
            </template>

        </DataView>
        
    </div>
</div>
</template>
<script setup>
import { onMounted, ref, inject,watch  } from 'vue';
import DataView from 'primevue/dataview';
const dialogRef = inject("dialogRef");
const data = ref({})
const loadingData = ref(false)
const productList = ref(dialogRef.value.data.product_list)
const currentViewItemBy = ref({ name: 'All', label: 'All Item' })
const views = ref([
    { name: 'All', label: 'All Item' },
    { name: 'By User', label: 'My Counted Item' }
]);
function callback(item){
    dialogRef.value.close({
        product: item
    });
}

</script>
<style scoped>
.item {
    border: 1px solid;
    border-color: #e2e8f0;
    padding: 5px;
    margin-bottom: 10px;
    line-height: 1.3;
    border-radius: 10px;
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid #e2e8f0;
}

th,
td {
    border: 1px solid #e2e8f0;
    padding: 4px;
    text-align: left;
    line-height: 1;
}

.bold {
    font-weight: 500
}

td:first-child,
th:first-child {
    white-space: nowrap;
}

::v-deep .p-dataview-content {
    max-height: 35vh;
    overflow: auto
}

.text-center {
    text-align: center
}

.text-right {
    text-align: right
}

.text-bold {
    font-weight: bold;
}
::v-deep .p-component{
    width: 100%;
}
</style>