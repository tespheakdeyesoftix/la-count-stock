<template lang="">
    <div  style="margin-top:5px">
      
        <div>
        <div class="grid-container" >
        <Dropdown v-if="!showdropdown"  style="width:100%" v-model="selectedDevice" :options="availableDevices" optionLabel="label"   placeholder="Select a Camera" class="w-full" />
        <Button v-if="!showdropdown" class="p-button" @click="startCamera">Scan</Button>
        </div>
        </div>
        
        <div style="width:100%;height:100%;overflow: hidden;">
          <qrcode-stream
          :constraints="constraints"
          :track="trackFunctionSelected.value"
          :formats="selectedBarcodeFormats"
          @error="onError"
          @detect="onDetect"
          @camera-on="onCameraReady"
          :paused="paused"
        />
        </div>
      </div>
</template>
<script setup>
import { ref, onMounted,inject,onUnmounted,computed, pushScopeId  } from 'vue';
import ComUpdateProductQuantity from '@/components/ComUpdateProductQuantity.vue'
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { getApi, postApi } from '@/utils';
import { useDialog } from 'primevue/usedialog';
const countProdct=inject("$countProduct")
const dialog = useDialog();
let cameraList = ref([]);
let loadingQty= ref()
 const selectedDeviceID = ref(null)
let activeStream = null; // Track the active camera stream
const showdropdown = ref() 
import { QrcodeStream} from 'vue-qrcode-reader'
    const result = ref('')
    const paused = ref(false)
function stop(){
  paused.value = true
}
  function onDetect(detectedCodes) {
     
    
    let barcode =(detectedCodes.map((code) => code.rawValue)[0]).trim()
    if (barcode){
      paused.value = true 
      searchProduct(barcode);
    }
    
  }
  
  /*** select camera ***/
  
  const selectedDevice = ref(null)
  const availableDevices = ref(null)
  


function startBarcodeScanner(cameraId) {
    showdropdown.value = true;
    // Access the selected camera
    navigator.mediaDevices.getUserMedia({ video: { deviceId: cameraId } })
    .then(function(stream) {
      // Store the active stream
      activeStream = stream;

      // Create a video element to stream the camera feed
      const video = document.createElement('video');
      video.setAttribute('autoplay', '');
      video.setAttribute('playsinline', '');
      video.srcObject = stream;
      document.querySelector('#video').textContent =""
      document.querySelector('#video').appendChild(video);

      // Load barcode detection model
      const barcodeScanner = new BarcodeDetector();

      // Variable to track if a barcode is already detected
      let barcodeDetected = false;

      // Continuously detect barcodes
      setInterval(async () => {
        try {
          // If a barcode is already detected, stop scanning
          if (barcodeDetected) return;

          // Detect barcodes in the video stream
          const barcodes = await barcodeScanner.detect(video);

          // Display detected barcodes
          if (barcodes.length > 0) {
            barcodeDetected = true;
              // Stop the camera feed
            stopCamera();
            // Alert the detected barcode
            // alert(`Detected Barcode: ${barcodes[0].rawValue}`);
            searchProduct(barcodes[0].rawValue)
          }  
        } catch (error) {
          console.error('Barcode detection failed:', error);
        }
      }, 1000); // Scan for barcodes every second
    })
    .catch(function(error) {
      console.error('Unable to access the camera:', error);
    });
  }

  
  async function onCameraReady() {
    // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
    // camera access permission. `QrcodeStream` internally takes care of
    // requesting the permissions. The `camera-on` event should guarantee that this
    // has happened.
    availableDevices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
      ({ kind }) => kind === 'videoinput'
    )
  }
  
  const constraints = computed(() => {
    if (selectedDevice.value === null) {
      return { facingMode: 'environment' }
    } else {
      return { deviceId: selectedDevice.value.deviceId }
    }
  })
  
  /*** track functons ***/
 
  function paintBoundingBox(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height }
      } = detectedCode
  
      ctx.lineWidth = 2
      ctx.strokeStyle = '#007bff'
      ctx.strokeRect(x, y, width, height)
    }
  } 
 
  const trackFunctionSelected = ref({ text: 'bounding box', value: paintBoundingBox })
  
  /*** barcode formats ***/
  
  const barcodeFormats = ref({
    aztec: true,
    code_128: true,
    code_39: true,
    code_93: true,
    codabar: true,
    databar: true,
    databar_expanded: true,
    data_matrix: true,
    dx_film_edge: true,
    ean_13: true,
    ean_8: true,
    itf: true,
    maxi_code: true,
    micro_qr_code: true,
    pdf417: true,
    qr_code: true,
    rm_qr_code: true,
    upc_a: true,
    upc_e: true,
    linear_codes: true,
    matrix_codes: true
  })
  const selectedBarcodeFormats = computed(() => {
    return Object.keys(barcodeFormats.value).filter((format) => barcodeFormats.value[format])
  })
  
  /*** error handling ***/
  
  const error = ref('')
  
  function onError(err) {
    error.value = `[${err.name}]: `
  
    if (err.name === 'NotAllowedError') {
      error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
      error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
      error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
      error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
      error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
      error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
      error.value +=
        'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
      error.value += err.message
    }
  }
 
onUnmounted(()=>{
  
}) 
async function  searchProduct(barcode){
  
  
  
  if (countProdct.stockReconcil.items.filter((item) => item.item_code == barcode.replace('!', '')).length > 0) {
    const exist_item = JSON.parse(JSON.stringify(countProdct.stockReconcil.items.find((item) => item.item_code == barcode.replace('!', ''))))
        exist_item.qty = exist_item.qty + 1
        exist_item.date = new Date()
        
        dialog.open(ComUpdateProductQuantity, {
        data:{"product":exist_item}, 
        props: {
            header: 'Scan Product',
            style: {
                width: '100%',
            },
            breakpoints:{
                '960px': '100%',
                '640px': '100%'
            },
            modal: true,
            
        },
        onClose: (opt) => {
          paused.value = false
        }
      });
    
    } else {
        loadingQty.value = true;
        
       await postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_item_qty_from_warehouse", {

        // await postApi("api/method/epos_restaurant_2023.api.la_stock.get_item_qty_from_warehouse", {
            param: JSON.stringify({
                warehouse: countProdct.stockReconcil.set_warehouse,
                item_code: barcode,
                name: countProdct.stockReconcil.name
            })
        }).then(r => {
            r.message.qty = r.message.qty + 1
            r.message.date = new Date()
            dialog.open(ComUpdateProductQuantity, {
              data:{"product":r.message},
            props: {
                header: 'Scan Product',
                style: {
                    width: '100%',
                },
                breakpoints:{
                    '960px': '100%',
                    '640px': '100%'
                },
                modal: true,
                
                
            },
            onClose: (opt) => {
              paused.value = false
        }
          
          });
            loadingQty.value = false
        }).catch(err => {
          paused.value = false
            loadingQty.value = false
        })
}}

</script>
<style scoped>
    .grid-container {
  display: grid;
  grid-template-columns: 80% 20%;
  gap: 10px;
}
    .styled-hr {
  border: 0;
  height: 1px; 
  background-color: rgb(164, 163, 163); 
  margin-top: 10px; 
  margin-bottom: 10px; 
}
.cameralist{
  padding: 10px;
  display: flex;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  align-items: center;
 
}
.icon-cam{
  background-color: aliceblue;
  border-radius: 10px;
  padding: 20px 20px 15px 20px;
  margin-right: 10px;
}
.p-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}
::v-deep .p-dialog-header{
padding: 1px !important;
}
</style>