<script lang="ts" setup>
import '@/assets/css/chat-layout.css';
import { ref } from 'vue';
import UserCheck from '~/components/UserCheck.vue';
import UserList from '~/components/UserList.vue';

const sidebarVisible = ref(false);

// 모바일에서 사이드바 열기/닫기
function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
</script>

<template>
  <div class="main-container">
    <UserCheck />

    <button class="mobile-toggle" @click="toggleSidebar">☰</button>

    <aside :class="{ 'mobile-open': sidebarVisible }">
      <UserList />
    </aside>

    <main>
      <slot />
    </main>
  </div>
</template>
