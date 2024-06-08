<template lang="">
    <div style="width:100%;padding-bottom:10px">
        <div class="fix_header">
            {{keyword}}
        </div>
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
const keyword = ref(dialogRef.value.data.keyword)
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
::v-deep .p-dataview-content{
    max-height: none !important;
    margin-top: 10px;
}
::v-deep .p-dialog-content{
    margin-bottom: 20px;
    margin-left: 11px;
}
.fix_header{
    position: fixed;
    background: white;
    width: 96%;
    border-left: 2px solid #8dd97f;
    padding-left: 10px;
    top: 50px;
    padding-right: 20px;
    font-size: 20px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
</style>