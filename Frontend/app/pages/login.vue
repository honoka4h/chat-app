<script lang="ts" setup>
    interface LoginResponse {
        message: string;
        userid: string;
        username: string;
        nickname: string;
    }
    
    import { useAuthStore } from '~/stores/auth';
    const authStore = useAuthStore();

    const router = useRouter();
    const config = useRuntimeConfig();

    const username = ref<string>('');
    const password = ref<string>('');

    async function getLogin(): Promise<void> {
        try {
            const data: LoginResponse = await $fetch(`${config.public.apiBase}/api/users/login`, {
                method: "POST",
                credentials: 'include',
                body: {
                    username: username.value,
                    password: password.value
                }
            });

            if (data) {
                alert(data.message);
                authStore.setUser(data.username, data.userid, data.nickname);
                router.push("/chat");
            };
        } catch(error) {
            console.error(error);
            alert("로그인에 실패했습니다.");
        }
    }
</script>

<template>
    <section class="default-main">
        <h1>로그인</h1>

        <form class="default-form" @submit.prevent="getLogin">
            <div class="form-input">
                <input class="primary-input" v-model="username" type="text" placeholder="아이디" />
                <input class="primary-input" v-model="password" type="password" placeholder="비밀번호" />
            </div>
            
            <button class="primary-button" type="submit">
                로그인
            </button>
        </form>
        
        <NuxtLink to="/register">아직 계정이 없으신가요?</NuxtLink>
    </section>
</template>