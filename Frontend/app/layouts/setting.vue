<script lang="ts" setup>
import '@/assets/css/chat-layout.css';
import { ref } from 'vue';
import UserCheck from '~/components/UserCheck.vue';
import SettingMenu from '~/components/SettingMenu.vue';

const sidebarVisible = ref(false);

// 모바일에서 사이드바 열기/닫기
function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
</script>

<template>
  <div class="main-container">
    <UserCheck />

    <!-- 모바일 토글 버튼 -->
    <button class="mobile-toggle" @click="toggleSidebar">☰</button>

    <aside :class="{ 'mobile-open': sidebarVisible }">
      <SettingMenu />
    </aside>

    <main>
      <div class="setting-content">
        <slot />
      </div>
    </main>
  </div>
</template>
