<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { io } from 'socket.io-client';

definePageMeta({
  layout: 'chat'
});

const config = useRuntimeConfig();
const auth = useAuthStore();
const socket = io(`${config.public.apiBase}`, { withCredentials: true });

// 접속 시 사용자 등록
socket.emit('registerUser', auth.userid);

// 수신된 친구 요청 목록
const friendRequests = ref<{ requestId: number; fromUserId: string; fromUserName: string }[]>([]);
const friendUsername = ref('');

// 친구 추가 요청 보내기
function sendFriendRequest() {
  socket.emit('sendFriendRequest', {
    fromUserId: auth.userid,
    toUserName: friendUsername.value
  });
  friendUsername.value = '';
}

function respondToRequest(requestId: number, accepted: boolean) {
  socket.emit('respondFriendRequest', { requestId, accepted });
  // 화면에서 즉시 제거
  friendRequests.value = friendRequests.value.filter(r => r.requestId !== requestId);
}

// 서버로부터 이벤트 받기
socket.on('friendRequestSent', (data) => {
  alert(`친구 요청을 ${data.toUserName}에게 보냈음`);
});

socket.on('friendRequestReceived', (data) => {
  friendRequests.value.push(data);
});

socket.on('friendAccepted', (data) => {
  alert(`${data.receiverid === auth.userid ? '상대방이' : '너가'} 친구 요청을 수락했습니다.`);
});


async function fetchFriendRequests() {
  try {
    const { data, error } = await useFetch<{
      requests: { id: number; senderid: string; sendername: string }[]
    }>(`${config.public.apiBase}/api/users/friendRequests`, {
      credentials: 'include',
    })

    if (error.value) {
      console.error('친구 요청 목록 불러오기 실패:', error.value)
      return
    }

    friendRequests.value =
      data.value?.requests?.map((r) => ({
        requestId: r.id,
        fromUserId: r.senderid,
        fromUserName: r.sendername,
      })) || []
  } catch (err) {
    console.error('HTTP 요청 에러:', err)
  }
}

const friends = ref<{ userid: string; username: string }[]>([]);

async function fetchFriends() {
  try {
    const { data, error } = await useFetch<{ friends: { userid: string; username: string }[] }>(
      `${config.public.apiBase}/api/users/friends`,
      { credentials: 'include' }
    );

    if (error.value) {
      console.error('친구 목록 불러오기 실패:', error.value);
      return;
    }

    friends.value = data.value?.friends || [];
  } catch (err) {
    console.error('HTTP 요청 에러:', err);
  }
}

// --- 친구 아바타 캐싱 ---
const friendAvatars = ref<Record<string, string>>({});

async function fetchFriendAvatar(userid: string) {
  if (friendAvatars.value[userid]) return friendAvatars.value[userid];

  try {
    const res = await fetch(`${config.public.apiBase}/api/users/${userid}/profile`);
    const data = await res.json();

    const url = `${config.public.apiBase}/uploads/profiles/${data.profileImage}`;
    friendAvatars.value[userid] = url;
    return url;
  } catch {
    const fallback = `${config.public.apiBase}/uploads/profiles/default-avatar.jpg`;
    friendAvatars.value[userid] = fallback;
    return fallback;
  }
}

// 친구 목록 불러온 뒤 자동으로 아바타도 불러오기
watch(
  () => friends.value,
  (list) => {
    list.forEach(f => {
      if (!friendAvatars.value[f.userid]) {
        fetchFriendAvatar(f.userid);
      }
    });
  },
  { deep: true }
);

onMounted(() => {
  fetchFriends();
  fetchFriendRequests();
})

</script>

<template>
  <div class="container p-4" style="max-width:720px;">
    <h3 class="text-xl font-bold" style="color:var(--text); margin-bottom:12px;">친구 추가</h3>

    <form @submit.prevent="sendFriendRequest" class="sidebar-search" style="display:flex; gap:8px; margin-bottom:16px;">
      <input
        v-model="friendUsername"
        type="text"
        placeholder="친구의 사용자 이름"
        aria-label="친구의 사용자 이름"
      />
      <button type="submit" class="btn-primary">전송</button>
    </form>

    <section style="margin-top:18px;">
      <h4 style="margin:0 0 8px 0; color:var(--text); font-weight:700;">받은 친구 요청</h4>
      <ul style="list-style:none; padding:0; margin:0;">
        <li v-for="req in friendRequests" :key="req.requestId" class="user-item" style="justify-content:space-between;">
          <div class="user-meta">
            <div class="user-name">{{ req.fromUserName }}</div>
            <div class="user-last" style="font-size:12px;">요청을 보냈습니다.</div>
          </div>
          <div class="user-actions">
            <button @click="respondToRequest(req.requestId, true)" class="btn" style="background:#16a34a; color:white; padding:6px 10px; border-radius:8px;">수락</button>
            <button @click="respondToRequest(req.requestId, false)" class="btn" style="background:#dc2626; color:white; padding:6px 10px; border-radius:8px;">거절</button>
          </div>
        </li>
        <li v-if="friendRequests.length === 0" class="user-last" style="padding:8px 0; color:var(--muted);">받은 요청이 없습니다.</li>
      </ul>
    </section>

    <section style="margin-top:22px;">
      <h4 style="margin:0 0 8px 0; color:var(--text); font-weight:700;">친구 목록</h4>
      <ul style="list-style:none; padding:0; margin:0;">
        <li v-for="f in friends" :key="f.userid" class="user-item" style="align-items:center;">
          <div class="user-avatar">
            <img :src="friendAvatars[f.userid]" alt="avatar" />
          </div>

          <div class="user-meta">
            <div class="user-name">{{ f.username }}</div>
          </div>
        </li>
        <li v-if="friends.length === 0" class="user-last" style="padding:8px 0; color:var(--muted);">친구가 없습니다.</li>
      </ul>
    </section>
  </div>
</template>