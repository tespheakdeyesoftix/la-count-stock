<template lang="">
    <div  style="margin-top:5px">
      <div style="display:flex;justify-content: space-between;margin-bottom: 5px;">
          <div>
          </div>
          <div @click="closeDialog()">
            x
          </div>
      </div>
        <div>
        <div class="grid-container" >
        <Dropdown  style="width:100%" v-model="selectedDeviceID" :options="cameraList" optionLabel="name" optionValue="deviceID" placeholder="Select a Camera" class="w-full" />
        <Button  class="p-button" @click="startCamera">Scan</Button>
        </div>
        </div>
        <div id='video'></div>
      </div>
</template>
<script setup>
import { ref, onMounted,inject,onUnmounted  } from 'vue';
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
const closeDialog = () => {
  dialog.value.close();
}
onMounted(()=>{
    // Check if Barcode Detection API is supported by the browser
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices || !navigator.mediaDevices.getUserMedia) {
  alert("Your browser doesn't support the Barcode Detection API");
} else {
  // Get the list of available video input devices (cameras)
  var constraints = {video: true, audio: false};
     navigator.mediaDevices.getUserMedia(constraints).then(stream => {
  
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
        const cameras = devices.filter(function(device) {
          return device.kind === 'videoinput';
        });
        cameras.forEach(function(camera, index) {
        
          cameraList.value.push({"deviceID":camera.deviceId,"name":`Camera ${index + 1}`})
        });
      });


    })
  
  }
 

})

function startBarcodeScanner(cameraId) {
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

  // Function to stop the camera feed
  function stopCamera() {
    if (activeStream) {
      activeStream.getTracks().forEach(track => track.stop());
      activeStream = null;
      document.querySelector('#video').textContent =""
    }
  }
function startCamera(){
  if (!selectedDeviceID.value){
    alert("Please select camera")
    return
  }
    if (activeStream) {
      stopCamera();
    }
    startBarcodeScanner(selectedDeviceID.value);
}
onUnmounted(()=>{
  stopCamera();
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
              startCamera()
        }
      });
    
    } else {
        loadingQty.value = true;
        
       // await postApi("api/method/erpnext.stock.doctype.stock_reconciliation.stock_reconciliation.get_item_qty_from_warehouse", {

        await postApi("api/method/epos_restaurant_2023.api.la_stock.get_item_qty_from_warehouse", {
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
              startCamera()
        }
          
          });
            loadingQty.value = false
        }).catch(err => {
            alert(err)
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