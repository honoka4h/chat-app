<script lang="ts" setup>
import '@/assets/css/chat-layout.css';

const config = useRuntimeConfig();
const sidebarVisible = ref(false);
const friends : any = ref([]);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
</script>

<template>
  <div class="chat-layout">
    <UserCheck />

    <!-- <button class="mobile-toggle" @click="toggleSidebar">☰</button> -->

    <!-- <aside class="chat-aside" :class="{ 'mobile-open': sidebarVisible }">
      <UserList />
    </aside> -->

    <aside class="chat-aside">
      <UserList />
    </aside>

    <main>
      <slot />
    </main>
  </div>
</template>
