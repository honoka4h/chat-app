<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick, onUpdated, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { useAuthStore } from '~/stores/auth';
import '@/assets/css/chat-room.css';

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const auth = useAuthStore();

const roomId = Number(route.params.roomId);
const messages = ref<{ userid: string; username: string; nickname: string; content: string; createdAt: string }[]>([]);
const message = ref('');
const socket = io(`${config.public.apiBase}`, { withCredentials: true });
const messagesContainer = ref<HTMLElement | null>(null);
const userAvatars = ref<Record<string, string>>({});

definePageMeta({
  layout: 'chat',
});

/* -----------------------------
   프로필 이미지 캐싱
----------------------------- */
async function fetchAvatar(userid: string) {
  if (userAvatars.value[userid]) return userAvatars.value[userid];

  try {
    const res = await fetch(`${config.public.apiBase}/api/users/${userid}/profile`);
    const data = await res.json();

    const url = `${config.public.apiBase}/uploads/profiles/${data.profileImage}`;
    userAvatars.value[userid] = url;
    return url;
  } catch {
    userAvatars.value[userid] = `${config.public.apiBase}/uploads/profiles/default-avatar.jpg`;
    return;
  }
}

/* -----------------------------
   소켓 관련
----------------------------- */
function setupSocketListeners() {
  socket.on('previousMessages', (msgs) => {
    messages.value = Array.isArray(msgs) ? msgs : [];
  });

  socket.on('receiveMessage', (msg) => {
    messages.value.push(msg);
  });

  socket.on('roomMembers', (members) => {
    console.log('room members:', members);
  });
}

function joinRoom() {
  if (!auth.userid) return;
  // 리스너를 먼저 등록하면 서버에서 바로 보내는 초기 이벤트를 놓치지 않습니다.
  setupSocketListeners();
  socket.emit('joinRoom', { roomId, userId: auth.userid });
}

watch(
  () => auth.userid,
  (newVal) => {
    if (!newVal) {
      router.push('/');
    } else {
      joinRoom();
    }
  },
  { immediate: true }
);

/* -----------------------------
   아바타 선불러오기
----------------------------- */
watch(
  () => messages.value,
  (msgs) => {
    msgs.forEach((m) => {
      if (!userAvatars.value[m.userid]) {
        fetchAvatar(m.userid);
      }
    });
  },
  { deep: true }
);

/* -----------------------------
   핵심: 연속 메시지 병합 + 1분 경과시 분리
----------------------------- */
const groupedMessages = computed(() => {
  const out: {
    userid: string;
    username: string;
    nickname: string;
    content: string;
    createdAt: string;
  }[] = [];

  for (const m of messages.value) {
    const last = out[out.length - 1];

    if (last && last.userid === m.userid) {
      const prev = new Date(last.createdAt).getTime();
      const curr = new Date(m.createdAt).getTime();
      const diff = curr - prev; // ms

      if (diff < 60000) {
        // 1분 이내 → 기존 섹션에 이어붙이기
        last.content = last.content + '\n' + m.content;
        last.createdAt = m.createdAt;
        continue;
      }
      // 1분 이상 지났으면 새로운 섹션 생성
    }

    out.push({
      userid: m.userid,
      username: m.username,
      nickname: m.nickname,
      content: m.content,
      createdAt: m.createdAt
    });
  }

  return out;
});

/* -----------------------------
   자동 스크롤
----------------------------- */
onUpdated(async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
});

/* -----------------------------
   파기
----------------------------- */
onUnmounted(() => {
  socket.off('previousMessages');
  socket.off('receiveMessage');
  socket.off('roomMembers');
  socket.disconnect();
});

/* -----------------------------
   메시지 전송
----------------------------- */
function sendMessage() {
  if (!message.value.trim() || !auth.userid) return;
  socket.emit('sendMessage', { roomId, userId: auth.userid, content: message.value });
  message.value = '';
}
</script>

<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(g, i) in groupedMessages"
        :key="i"
        :class="['message', g.userid === auth.userid ? 'me' : 'other']"
      >
        <div class="message-header">
          <img class="avatar" :src="userAvatars[g.userid]" alt="avatar" />
          <strong class="nickname">{{ g.nickname }}</strong>
          <div class="small">{{ new Date(g.createdAt).toLocaleString() }}</div>
        </div>

        <div class="content">{{ g.content }}</div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="input-form">
      <input v-model="message" placeholder="메시지 입력..." autocomplete="off" />
      <button type="submit">전송</button>
    </form>
  </div>
</template>
