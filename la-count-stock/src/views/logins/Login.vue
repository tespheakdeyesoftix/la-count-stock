<template>
    
    <div class="form-box">
      <div class="m-auto">
        <div>
          <label for="username">Username</label>  
        </div>
        <div class="w-full">
          <InputText class="w-full" id="username" v-model="user.usr" />
        </div>
      </div>  
      <div>
        <div>
            <label for="password">Password</label>
        </div>
        <div class="w-full">
            <Password input-class="w-full" class="w-full" id="password" v-model="user.pwd" />
        </div>
        
      </div>  
        <div class="w-full mt-2">
          <Button class="w-full btn" @click="onLogin">Login</Button>
        </div>
        
    </div>
</template>
<script setup>
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

import router from '@/router';
import { ref, inject } from 'vue'
const user = ref({ "usr": "", "pwd": "" })
const auth = inject('$auth')
const loginErrorText=ref("")
function onLogin() {
    auth.login(user.value.usr, user.value.pwd).then((res) => {
        router.push({ name: 'home' })
    }).catch((err) => {
      
    })

}


</script>
<style scoped>
.w-full{
    width: 100% !important;
}
.mt-2{
    margin-top: 10px;
}
.form-box{
    border-width: 3px 0px 0px 0px; /* top right bottom left */
  border-style: solid;
  border-color: rgb(16, 185, 129);
    padding: 30px;
  
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
.btn{
    display: flex;
  justify-content: center;
}
::v-deep .p-password-input{
    width: 100% !important;
}
</style>