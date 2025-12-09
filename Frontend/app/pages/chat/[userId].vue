<script setup lang="ts">
import { io } from 'socket.io-client';
import { useAuthStore } from '~/stores/auth';
import '@/assets/css/chat-room.css';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const socket = io(`${config.public.apiBase}`);

interface Message {
  id: string | number;
  room_name: string;
  sender_id: number;
  receiver_id: number;
  content: string;
  status: string;
  created_at: string;
}

const friendId = route.params.userId as string;
const messages = ref<Message[]>([]);
const friendNick = ref<string>('');
const input = ref<string>('');

definePageMeta({
  layout: 'chat',
});

function friendMiddleware() {
  let isExistingFriend : boolean = false;
  for (const friend of authStore.friends) {
    if (friend.id == Number(friendId)) {
      isExistingFriend = true;
    }
  }

  if (!isExistingFriend) {
    alert("실제 존재하는 userId가 아니거나, 친구로 등록되지 않은 사용자입니다.");
    router.push('/chat');
  }

  return isExistingFriend
}

function formatKoreanTime(isoString: string) {
  const date = new Date(isoString);
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day}일 ${hours}시 ${minutes}분`;
}

async function sendMessage() {
  const isExistingFriend = friendMiddleware();
  if (!isExistingFriend) return;

  socket.emit('sendMessage', {
    fromId: authStore.userid, toId: friendId, content: input.value
  });

  alert("메세지를 보냈습니다.")
}

onMounted(() => {
  const isExistingFriend = friendMiddleware();
  if (!isExistingFriend) return;

  socket.emit('joinDirectRoom', {
    userId1: authStore.userid, userId2: friendId
  });

  socket.on('joinedRoom', (roomName) => {
    alert(`${roomName} 방에 입장했습니다.`);
  });

  socket.on('previousMessage', (msgs) => {
    if (!msgs) return;
    messages.value = msgs
  })

  // 보내는 사람 확인
  for (const fri of authStore.friends){
    if (fri.id == Number(friendId)) friendNick.value = fri.nickname;
  }
})

</script>

<template>
  <section class="chat-container">
    <div>
      <h3>메세지 내용</h3>
      <p v-for="item in messages" :key="item.id">
        {{ item.sender_id === authStore.userid ? authStore.nickname : friendNick }} : {{ item.content }} - {{ formatKoreanTime(item.created_at) }}
      </p>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="input" type="text" />
      <button type="submit">전송</button>
    </form>
  </section>
</template>
