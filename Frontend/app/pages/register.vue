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
    <div>
        <h1>회원가입</h1>

        <form @submit.prevent="getRegister">
            <input v-model="username" type="text" placeholder="아이디" />
            <input v-model="email" type="text" placeholder="이메일" />
            <input v-model="password" type="password" placeholder="비밀번호" />
            
            <button type="submit">
                전송
            </button>
        </form>
    </div>
</template>