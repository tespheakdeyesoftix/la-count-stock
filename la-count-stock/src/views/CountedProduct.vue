<template>
    <div style="margin: 10px;">
        <div style="text-align: center;margin-top: 6px;"><a
                @click="viewStockReconcilClick(countProduct?.stockReconcil?.name)">{{ countProduct?.stockReconcil?.name
                }}</a> <br /> {{ countProduct?.stockReconcil?.set_warehouse }}</div>
        <div class="">
            <div style="margin-top:10px;">
                <InputText style="width: 100%;" ref="barcodeInput" placeholder="Enter or Scan QR Code" type="text"
                    v-model="barcode" @keyup="save" @keyup.enter="saveEnter" />
            </div>
            <div class="OpenCamera"> <Button @click="onCheckClick" class="p-button">Check</Button> </div>
            <div class="OpenCamera"> <Button @click="OpenCamera" class="p-button">Scan Camera</Button> </div>
        </div>


        <br />
        <ul v-if="countProduct.stockReconcil" style="list-style-type: none;padding-left: 0;padding-top:10px;width: 100%;">
            <li v-for="d in countProduct.stockReconcil.items?.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))"
                style="margin-bottom: 8px;">
                <div style="display: flex;gap:5px;width: 100%;justify-content: space-between;">
                    <div class="cart-item" style="width: 100%;justify-content: space-between;">
                        <div>
                            <div>
                                {{ d.item_name }}
                            </div>
                            <div>{{ d.item_code }}</div>
                            <div>Qty on hand: {{ d.actual_qty }}</div>
                            <div>{{ d.stock_uom }}</div>
                        </div>
                        <div>
                            <div class="qty-in-de">
                                <Button style="color: red;" class="decrease-btn" icon="pi pi-minus"
                                    @click="SubstractQty(d)" />
                                <div class="qty-wrapper">
                                    <InputNumber input-class="newinputnumber" v-model="d.qty" class="qty-cus"
                                        @update:modelValue="qtyChanged(d, e)" />
                                </div>
                                <Button style="color: green;" class="increase-btn" icon="pi pi-plus" @click="addQty(d)" />
                            </div>
                        </div>
                        <Button class="delete-btn" style="color:red" icon="pi pi-trash" @click="deleteItem(d)" />
                    </div>

                </div>
            </li>
        </ul>
    </div>
    <div class="btn-footer-cus">
        <Button v-if="countProduct.stockReconcil?.items?.length > 0" label="Submit to Server" @click="submitReconcil" />
        <Button label="Back" @click="onBack" />
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
import ComUpdateProductQuantity from '@/components/ComUpdateProductQuantity.vue'
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { getApi, postApi } from '@/utils';
import { useRoute } from 'vue-router'
import { ref, onMounted, inject, watch } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useDialog } from 'primevue/usedialog';
import ComCameraDetectedModal from '@/components/ComCameraDeletedModal.vue'
import StockReconcilDetail from '@/components/StockReconcilDetail.vue'
import ComSelectProductList from '@/components/ComSelectProductList.vue'
const route = useRoute()
const confirm = useConfirm();
const value = ref(null);
const barcode = ref(null);
const isLoading = ref(false);
const loadingQty = ref(false);
const barcodeInput = ref(null);
const inputRefs = ref([]);
const countProduct = inject('$countProduct')
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
    countProduct.stockReconcil = JSON.parse(localStorage.getItem(route.params.name))
    barcodeInput.value.$el.focus()
})
function save(e) {

    if (e.key == "!") {
        addItem()
        const el = document.querySelector(".qty-wrapper input");
        el.focus()
        setTimeout(() => {
            el.select()
        }, 500);
        e.preventDefault()
    }
}

function onCheckClick(e) {

    addItemOnCheck()
    const el = document.querySelector(".qty-wrapper input");
    if (el) {
        el.focus()
        setTimeout(() => {
            el.select()
        }, 500);
    }


    e.preventDefault()

}

function OpenCamera() {
    dialog.open(ComCameraDetectedModal, {
        props: {
            style: {
                width: '100%',
                height: '100vh',
                margin: '0',
            },
            breakpoints: {
                '960px': '100vw',
                '640px': '100vw'
            },
            contentStyle: {
                padding: '0px 15px 0px 5px'
            },
            modal: true
        }
    });

}
function saveEnter(e) {

    if (barcode.value) {
        if (e.key == 'Enter') {
            addItem()

            setTimeout(() => {
                const el = document.querySelector(".qty-wrapper input");
                if (el) {
                    el.focus()
                    el.select()
                }

            }, 200);

            e.preventDefault()

        }
    }

}

async function addItemOnCheck() {

    if (countProduct.stockReconcil.items.length > 20) {
        alert('Item can not more than 20. please submit.')
        return
    }
    loadingQty.value = true;
    await postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_item_qty_from_warehouse_contain_code", {
        // await postApi("api/method/epos_restaurant_2023.api.la_stock.get_item_qty_from_warehouse", {
        param: JSON.stringify({
            warehouse: countProduct.stockReconcil.set_warehouse,
            item_code: barcode.value.replace('!', ''),
            name: countProduct.stockReconcil.name
        })
    }).then(r => {
        dialog.open(ComSelectProductList, {
            data:
            {
                "product_list": r.message,
                "keyword": barcode
            },
            onClose: (opt) => {
    
                if (opt.data.product) {
                  
                    
                    const exist_item = countProduct.stockReconcil.items.find((item) => item.item_code == opt.data.product.item_code)
                    console.log(exist_item)
                    if (exist_item) {
                        exist_item.qty = exist_item.qty
                        r.message.date = new Date()
                        dialog.open(ComUpdateProductQuantity, {
                            data: { "product": exist_item },
                            props: {
                                header: 'Scan Product',
                                style: {
                                    width: '100%',
                                },
                                breakpoints: {
                                    '960px': '100%',
                                    '640px': '100%'
                                },
                                modal: true,

                            },
                            onClose: (opt) => {
                                paused.value = false
                            }
                        });
                        localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))

                    } else {
                        opt.data.product.qty = opt.data.product.qty || 0
                        dialog.open(ComUpdateProductQuantity, {
                            data: { "product": opt.data.product },
                            props: {
                                header: 'Scan Product',
                                style: {
                                    width: '100%',
                                },
                                breakpoints: {
                                    '960px': '100%',
                                    '640px': '100%'
                                },
                                modal: true,

                            },
                            
                        });
                       
                    }
                    barcode.value = ''
                }

            },
            props: {
                style: {
                    width: '60%',
                    height: '100vh',
                    margin: '0',
                },
                breakpoints: {
                    '960px': '100vw',
                    '640px': '100vw'
                },
                contentStyle: {
                    padding: '0px 15px 0px 5px'
                },
                modal: true
            }
        });


        loadingQty.value = false
    }).catch(err => {
        barcode.value = ''
        loadingQty.value = false
    })

}

async function addItem() {

    if (countProduct.stockReconcil.items.length > 20) {
        alert('Item can not more than 20. please submit.')
        return
    }
    const exist_item = countProduct.stockReconcil.items.find((item) => item.item_code == barcode.value.replace('!', '') || item.alternate_item_code == barcode.value.replace('!', ''))
    
    if (countProduct.stockReconcil.items.filter((item) => item.item_code == barcode.value.replace('!', '')  || item.alternate_item_code == barcode.value.replace('!', '')).length > 0) {
        exist_item.qty = exist_item.qty + 1
        exist_item.date = new Date()
        localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
        barcode.value = ''
    } else {
        loadingQty.value = true;
        await postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_item_qty_from_warehouse", {
            param: JSON.stringify({
                warehouse: countProduct.stockReconcil.set_warehouse,
                item_code: barcode.value.replace('!', ''),
                name: countProduct.stockReconcil.name
            })
        }).then(r => {
            if (r.message.qty) {
                r.message.qty = r.message.qty + 1
            } else {
                r.message.qty = 1
            }

            r.message.date = new Date()
            countProduct.stockReconcil.items.push(r.message)
            localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
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
                // postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.save_stock_reconcil", {
                param: JSON.stringify(countProduct.stockReconcil)
            }).then((r) => {
                countProduct.stockReconcil.items = []
                localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
                isLoading.value = false;
            }).catch((e) => {
                isLoading.value = false;
            })

        }

    });
};


function viewStockReconcilClick(name) {
    if (name) {
        dialog.open(StockReconcilDetail, {
            data: { "name": name },
            props: {
                style: {
                    width: '60%',
                    height: '100vh',
                    margin: '0',
                },
                breakpoints: {
                    '960px': '100vw',
                    '640px': '100vw'
                },
                contentStyle: {
                    padding: '0px 15px 0px 5px'
                },
                modal: true
            }
        });
    }

}

function addQty(d) {
    d.qty = d.qty + 1
    localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
}
function SubstractQty(d) {
    d.qty = d.qty - 1
    localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
}

function onQtyInput(d) {
    let valueString = event.target.value
    let valueInt = parseInt(valueString, 10);
    d.qty = valueInt
    localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
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
            countProduct.stockReconcil.items = countProduct.stockReconcil.items.filter(x => x.item_code != d.item_code)
            localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))

        }

    });

}
function qtyChanged() {
    localStorage.setItem(route.params.name, JSON.stringify(countProduct.stockReconcil))
}

</script>
<style scoped>
.cart-item {
    position: relative;
}

.OpenCamera {
    width: 100%;
    margin-top: 10px;
}

.p-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
}

.p-dialog-header {
    padding: 1px !important;
}

::v-deep .p-dialog-header {
    padding: 1px !important;
}

.delete-btn {
    padding: 15px;
    height: 20px;
    width: 20px;
    position: absolute;
    right: 5px !important;
    bottom: 5px;

}

.qty-cus {
    font-size: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
}

.newinputnumber {
    font-size: 15px !important;
}
</style>
