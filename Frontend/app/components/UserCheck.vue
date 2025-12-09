<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();

async function checkLogin() {
    try {
        const data : any = await $fetch(`${config.public.apiBase}/api/users/checklogin`, {
            method: "GET",
            credentials: 'include'
        })

        if (!data) {
            return
        }

        const user = data?.user;
        const friendList = data?.friendList;

        if(user?.userid) {
            authStore.setUser(user.username, user.userid, user.nickname, friendList);
            if (route.path === '/') {
                router.push('/chat');
            }
            return;
        }
        router.push('/');
    } catch(error : any) {
        alert(error?.data?.message || "오류가 발생했습니다. 다시 시도해주세요.");
        router.push('/');
    }
}
    
onMounted(() => {
    checkLogin();
})
</script>

<template>
    
</template>