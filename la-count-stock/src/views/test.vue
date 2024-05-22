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
          {{ device.label }} (ID: {{ device.deviceId }})
        </option>
      </select>
  
      <p>
  
  
        <select v-model="trackFunctionSelected">
          <option
            v-for="option in trackFunctionOptions"
            :key="option.text"
            :value="option"
          >
            {{ option.text }}
          </option>
        </select>
      </p>
  

  

   {{ result }}
  
  
      <div>
        <qrcode-stream
          :constraints="constraints"
          :track="trackFunctionSelected.value"
          :formats="selectedBarcodeFormats"
          @error="onError"
          @detect="onDetect"
          @camera-on="onCameraReady"
          :paused="true"
        />
      </div>
    </div>
  </template>
  
  <script setup>
    import { onMounted, computed ,onUnmounted, ref, pushScopeId } from 'vue';
    import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
    const result = ref('')
const pushed = ref(false)
function onDetect(detectedCodes) {
    
  result.value = JSON.stringify(detectedCodes.map((code) => code.rawValue))
  pushed.value = true 
   

}

/*** select camera ***/

const selectedDevice = ref(null)
const availableDevices = ref(null)

async function onCameraReady() {

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

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = 'red'

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}
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
function paintCenterText(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox, rawValue } = detectedCode

    const centerX = boundingBox.x + boundingBox.width / 2
    const centerY = boundingBox.y + boundingBox.height / 2

    const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'

    ctx.lineWidth = 3
    ctx.strokeStyle = '#35495e'
    ctx.strokeText(detectedCode.rawValue, centerX, centerY)

    ctx.fillStyle = '#5cb984'
    ctx.fillText(rawValue, centerX, centerY)
  }
}
const trackFunctionOptions = [
  { text: 'nothing (default)', value: undefined },
  { text: 'outline', value: paintOutline },
  { text: 'centered text', value: paintCenterText },
  { text: 'bounding box', value: paintBoundingBox }
]
const trackFunctionSelected = ref(trackFunctionOptions[1])



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

  