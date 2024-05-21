<template>
  <div style="margin: 10px;"> 
    <div style="text-align: center;">{{ stock_reconcil.name }} <br/> {{ stock_reconcil.set_warehouse }}</div>
    <InputText style="width: 100%;" ref="barcodeInput" placeholder="Enter or Scan QR Code" type="text" v-model="barcode" @keyup="save" @keyup.enter="saveEnter"/>
    <br/>
    <ul v-if="stock_reconcil" style="list-style-type: none;padding-left: 0;padding-top:10px;width: 100%;">
        <li v-for="d in stock_reconcil.items?.sort((a, b) => new Date(b.date) - new Date(a.date))" style="margin-bottom: 8px;">
            <div style="display: flex;gap:5px;width: 100%;justify-content: space-between;">
                <div class="cart-item" style="width: 100%;justify-content: space-between;">
                    <div>
                        <p>{{ d.item_name }}</p>
                        <p>{{ d.item_code }}</p>
                        <p>Qty on hand: {{ d.actual_qty }}</p>
                    </div>
                    <div>
                        <div class="qty-in-de">
                            <Button style="color: red;" class="decrease-btn" icon="pi pi-minus" @click="SubstractQty(d)"/>
                            <div class="qty-wrapper">
                                <InputNumber v-model="d.qty" class="qty-cus"/>
                            </div>
                            <Button style="color: green;" class="increase-btn" icon="pi pi-plus" @click="addQty(d)"/>
                        </div>
                    </div>
                </div>
                <Button class="delete-btn" style="color:red" icon="pi pi-trash" @click="deleteItem(d)"/>
            </div>
        </li>
    </ul>
</div>
<div class="btn-footer-cus">
    <Button v-if="stock_reconcil?.items?.length > 0" label="Submit to Server" @click="submitReconcil"/>
    <Button label="Back" @click="onBack"/>
</div>
<Dialog v-model:visible="isLoading" modal :closable="false" :style="{ width: '100%' }">
    <div style="display: flex;justify-content: center;">
        <div>
            <div style="text-align: center;">Submit data to server</div>
            <div style="text-align: center;">
                <ProgressSpinner />
            </div>
            <div style="text-align: center;">Please Wait...</div>
        </div>
    </div>
</Dialog>
</template>
<script setup>
import router from '@/router';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import BlockUI from 'primevue/blockui';
import Button from 'primevue/button';
import { getApi, postApi } from '@/utils';
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useDialog } from 'primevue/usedialog';
import ComCameraDetectedModal from '@/components/ComCameraDeletedModal.vue'
const confirm = useConfirm();
const value = ref(null);
const barcode = ref(null);
const isLoading = ref(false);
const loadingQty = ref(false);
const stock_reconcil = ref({});
const barcodeInput = ref(null);
const inputRefs = ref([]);

const dialog = useDialog();
const setInputRef = index => el => {
    inputRefs.value[index] = el;
};
function onBack() {
    router.push({
        name: 'home'
    })
}

onMounted(() => {

    stock_reconcil.value = JSON.parse(localStorage.getItem('selected_warehouse'))
    barcodeInput.value.$el.focus()
})
function save(e) {

    if (e.key == "!") {
        addItem()
        const el = document.querySelector(".qty-wrapper input");
        console.log(el)
            el.focus()
            setTimeout(() => {
                el.select()
            }, 500);
        e.preventDefault()
    }
}
function OpenCamera(){
    dialog.open(ComCameraDetectedModal, {
        props: {
            header: 'Scan Product',
            style: {
                width: '100%',
            },
            breakpoints:{
                '960px': '100%',
                '640px': '100%'
            },
            modal: true
        }});
    
}
function saveEnter(e) {
   
    if (barcode.value) {
        if (e.key == 'Enter') {
            addItem()
            
            setTimeout(() => {
                const el = document.querySelector(".qty-wrapper input");
                el.focus()
                el.select()
            }, 200);
            
            e.preventDefault()
            
        }
    }

}
async function addItem() {
    if (stock_reconcil.value.items.length > 20) {
        alert('Item can not more than 20. please submit.')
        return
    }
    const exist_item = stock_reconcil.value.items.find((item) => item.item_code == barcode.value.replace('!', ''))
    if (stock_reconcil.value.items.filter((item) => item.item_code == barcode.value.replace('!', '')).length > 0) {
        exist_item.qty = exist_item.qty + 1
        exist_item.date = new Date()
        localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))
        barcode.value = ''
    } else {
        loadingQty.value = true;
        await postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_item_qty_from_warehouse", {
            param: JSON.stringify({
                warehouse: stock_reconcil.value.set_warehouse,
                item_code: barcode.value.replace('!', ''),
                name: stock_reconcil.value.name
            })
        }).then(r => {

            r.message.qty = r.message.qty + 1
            r.message.date = new Date()
            stock_reconcil.value.items.push(r.message)

            localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))
            barcode.value = ''
            loadingQty.value = false
        }).catch(err => {
            barcode.value = ''
            loadingQty.value = false
        })
    }
}

function submitReconcil() {

    confirm.require({
        message: 'Are you sure you want to Submit Stock?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Submit',
        accept: () => {
            isLoading.value = true;
            postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.save_stock_reconcil", {
                param: JSON.stringify(stock_reconcil.value)
            }).then(r => {
                stock_reconcil.value.items = []
                localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))
                isLoading.value = false;
            }).catch((e) => {
                isLoading.value = false;
            })


        }

    });
};





function addQty(d) {
    d.qty = d.qty + 1
    localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))
}
function SubstractQty(d) {
    d.qty = d.qty - 1
    localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))
}

function onQtyInput(d) {
    let valueString = event.target.value
    let valueInt = parseInt(valueString, 10);
    d.qty = valueInt
    localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))
}

function deleteItem(d) {
    confirm.require({
        message: `Are you sure you want to delete item ${d.item_name}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: () => {
            stock_reconcil.value.items = stock_reconcil.value.items.filter(x => x.item_code != d.item_code)
            localStorage.setItem('selected_warehouse', JSON.stringify(stock_reconcil.value))

        }

    });

}
</script>
