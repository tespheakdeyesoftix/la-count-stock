<template>
    <div>
        <label for="username">Username</label>
        <InputText id="username" v-model="user.usr" />

        <label for="password">Password</label>
        <Password id="password" v-model="user.pwd" />
        <Button @click="onLogin">Login</Button>
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
function onLogin() {
    auth.login(user.value.usr, user.value.pwd).then((res) => {
        router.push({ name: 'home' })
    }).catch((err) => {

    })

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    console.log(`value ${document.cookie}`)
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

</script>
<style></style>