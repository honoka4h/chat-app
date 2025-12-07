<script lang="ts" setup>
    interface LoginResponse {
        message: string
    }

    const router = useRouter();
    const config = useRuntimeConfig();

    const username = ref<string>('');
    const password = ref<string>('');
    const email = ref<string>('');

    async function getRegister(): Promise<void> {
        try {
            const data: LoginResponse = await $fetch(`${config.public.apiBase}/api/users/register`, {
                method: "POST",
                body: {
                    username: username.value,
                    password: password.value,
                    email: email.value
                }
            });

            if (data) {
                alert(data.message);
                router.push("/");
            }
        } catch(error) {
            console.error(error);
            alert("회원가입에 실패했습니다.");
        }
    }
</script>

<template>
    <section class="default-main">
        <h1>회원가입</h1>

        <form class="default-form" @submit.prevent="getRegister">
            <div class="form-input">
                <input class="primary-input" v-model="username" type="text" placeholder="아이디" />
                <input class="primary-input" v-model="email" type="text" placeholder="이메일" />
                <input class="primary-input" v-model="password" type="password" placeholder="비밀번호" />
            </div>
            
            <button class="primary-button" type="submit">
                회원가입
            </button>
        </form>

        <NuxtLink to="/login">이미 계정이 있으신가요?</NuxtLink>
    </section>
</template>