<template lang="">
    <div>
        <table>
            <tr>
                <th class="text-bold">
                    Doc #
                </th>
                <td class="text-bold"> 
                    {{data.name}}
                </td>
                </tr>
            <tr>
                
                <th class="text-bold">
                    Company
                </th>
                <td> 
                    {{data.company}}
                </td>
                </tr>
                <tr>
                    <th class="text-bold">
                        Warehouse
                    </th>
                    <td> 
                        {{data.set_warehouse}}
                    </td>
                </tr>
        </table>

<div style="padding-top:8px;padding-bottom:8px" class="flex">
    <label class="w-6rem m-auto">View By:</label>
    <Dropdown v-model="currentViewItemBy" :options="views" optionLabel="label" placeholder="Select a View" class="w-full" />
</div>

<DataView :value="data.items" paginator :rows="5">
    <template #list="slotProps">
        <div class="grid grid-nogutter">
            <table>
                <thead>
                    <tr>
                        <th style="width:260px!important">Item</th>
                        <th class="text-center">QTY</th>
                        <th class="text-center">BOH</th>
                        <th class="text-center">Diff.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in slotProps.items" :key="index">
                        <td  style="width:260px!important;white-space: normal;"><span style="font-weight:bold">{{item.item_code}}</span>-{{item.item_name}}</td>
                        <td class="text-center">{{item.qty}}</td>
                        <td class="text-center">{{item.current_qty}}</td>
                        <td :style="{ 'color': item.quantity_difference <= 0? 'red' : 'green'}" class="text-center">
                            {{item.quantity_difference}}
                        </td>
                    </tr>
                </tbody>
                
                
            </table>
        </div>
    </template>
</DataView>






</div>
</template>
<script setup>
import { onMounted, ref, inject,watch  } from 'vue';
import { getApi, postApi } from '@/utils';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import Column from 'primevue/column';
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown';
const dialogRef = inject("dialogRef");
const data = ref({})
const loadingData = ref(false)
const reconcil_name = ref(dialogRef.value.data.name)
const currentViewItemBy = ref({ name: 'All', label: 'All Item' })
const views = ref([
    { name: 'All', label: 'All Item' },
    { name: 'By User', label: 'My Counted Item' }
]);
onMounted(() => {
    getApi("api/resource/Stock Reconciliation/" + reconcil_name.value).then(r => {
        data.value = r.data
    })
})
watch(currentViewItemBy, async (newcurrentViewItemBy, oldcurrentViewItemBy) => {
    loadingData.value=true
    if(newcurrentViewItemBy.name == "All"){
            getApi("api/resource/Stock Reconciliation/" + reconcil_name.value).then(r => {
                loadingData.value=false
            data.value = r.data
        })
        }else if(newcurrentViewItemBy.name == "By User"){
            loadingData.value=false
            postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_stock_reconcil_by_user?name=" + reconcil_name.value).then(r => {
            data.value.items = r.message
        }).catch(()=>{
            loadingData.value=false
        })
    }
})
</script>
<style scoped>
.item {
    border: 1px solid;
    border-color: #e2e8f0;
    padding: 5px;
    margin-bottom: 10px;
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
</style>