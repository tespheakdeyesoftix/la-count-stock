
<template>
    <div>
       
  
      <p
        class="error"
        v-if="availableDevices === null"
      >
        No cameras on this device
      </p>

      <select
        v-model="selectedDevice"
        v-else
      >
        <option
          v-for="device in availableDevices"
          :key="device.deviceId"
          :value="device"
        >
          {{ device.label }} 
        </option>
      </select>
  
      {{ selectedDevice }}
       
  
 
      <p class="decode-result">
        Last result: <b>{{ result }}</b>
      </p>
  
      <div>
        <qrcode-stream
          :constraints="constraints"
          :track="trackFunctionSelected.value"
          :formats="selectedBarcodeFormats"
          @error="onError"
          @detect="onDetect"
          @camera-on="onCameraReady"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  /*** detection handling ***/
  
    import { QrcodeStream} from 'vue-qrcode-reader'
    const result = ref('')
    const pushed = ref(false)
  function onDetect(detectedCodes) {
    
    result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  }
  
  /*** select camera ***/
  
  const selectedDevice = ref(null)
  const availableDevices = ref(null)
  
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

   
  </script>
  
  <style scoped>
  .error {
    font-weight: bold;
    color: red;
  }
  .barcode-format-checkbox {
    margin-right: 10px;
    white-space: nowrap;
    display: inline-block;
  }
  </style>
 
  