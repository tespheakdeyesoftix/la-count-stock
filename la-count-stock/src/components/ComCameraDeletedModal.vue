<template lang="">
    <div style="height:70vh">
        <h1>Barcode Scanner</h1>
        {{cameraList}}
        <p>Scan a barcode using your phone's camera:</p>
        <div>
        <label for="cameraSelect">Select Camera:</label>
        <select id="cameraSelect"></select>
        <button id="startScanButton">Start Scan</button>
        </div>
        <div id="barcodeResult"></div>
        <div id='video'></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
let cameraList = ref([]);
let x= ref()
 
let activeStream = null; // Track the active camera stream
onMounted(()=>{
    // Check if Barcode Detection API is supported by the browser
if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices || !navigator.mediaDevices.getUserMedia) {
  alert("Your browser doesn't support the Barcode Detection API");
} else {
  // Get the list of available video input devices (cameras)
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    const cameras = devices.filter(function(device) {
      return device.kind === 'videoinput';
    });

    // Populate the camera select dropdown
    const cameraSelect = document.getElementById('cameraSelect');
 
    cameras.forEach(function(camera, index) {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.text = `Camera ${index + 1}`;
      cameraSelect.appendChild(option);
      cameraList.value.push(`Camera ${index + 1}`)
    });
  })
  .catch(function(error) {
    console.error('Error enumerating devices:', error);
  });

  // Start scan barcode button click event
  document.getElementById('startScanButton').addEventListener('click', function() {
    const selectedCameraId = document.getElementById('cameraSelect').value;
    if (activeStream) {
      stopCamera();
    }
    startBarcodeScanner(selectedCameraId);
  });

  // Function to start barcode scanner with the selected camera
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
            document.getElementById('barcodeResult').innerHTML = `Detected Barcode: ${barcodes[0].rawValue}`;
            // Stop the camera feed
            stopCamera();
            // Alert the detected barcode
            alert(`Detected Barcode: ${barcodes[0].rawValue}`);
          } else {
            document.getElementById('barcodeResult').innerHTML = 'No barcode detected';
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
      
    }
  }
}

 

})

</script>
<style lang="">
    
</style>