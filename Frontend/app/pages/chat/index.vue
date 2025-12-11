<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { io } from 'socket.io-client';

const config = useRuntimeConfig();
const authStore = useAuthStore();

const friendName = ref<string>('');
const friends = ref<Friend[]>([]);

interface Friend {
  username: string;
  nickname: string;
}

definePageMeta({
  layout: 'chat'
});

async function addFriend() {
  try {
    const data : any = await $fetch(`${config.public.apiBase}/api/users/friend-request`, {
        method: "POST",
        credentials: 'include',
        body: {
          friendName: friendName.value
        }
    })

    if (!data) {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    if (data.status === 'accepted') {
      alert('친구 추가가 완료되었습니다. 새로고침 후 메세지를 보낼수 있습니다.');
    } else if (data.status === 'pending') {
      alert('친구 요청을 전송했습니다.');
    }
  } catch(error : any) {
      alert(error?.data?.message || "오류가 발생했습니다. 다시 시도해주세요.");
  }
}

watchEffect(() => {
  friends.value = authStore.friends;
})


</script>

<template>
  <section>
    <h3>친구 추가</h3>
    <form @submit.prevent="addFriend">
      <input type="text" placeholder="아이디를 입력하세요." v-model="friendName" />
      <button type="submit">전송</button>
    </form>

    <h3>친구 목록</h3>
    <div v-for="(item, index) in friends" :key="index">
      <p>{{ item.username }}</p>
    </div>
  </section>
</template>