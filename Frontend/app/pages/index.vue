<script lang="ts" setup>
import { watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

watch(
  () => authStore.username,
  (newVal) => {
    if (newVal) {
      router.push('/chat');
    }
  },
  { immediate: true }
);
</script>

<template>
  <section class="hero">
    <div class="hero-inner container">
      <h1 class="hero-title">메신저</h1>
      <p class="hero-sub">빠르고 안전한 메시징, 지금 시작하세요.</p>
      <div class="hero-actions">
        <NuxtLink to="/login" class="btn-primary">로그인</NuxtLink>
        <NuxtLink to="/register" class="btn-outline">회원가입</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  width: 100%;
  min-height: calc(100vh - 64px - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(15,18,22,0.6), rgba(6,8,12,0.6));
  padding: 40px 0;
}

.hero-inner { text-align: center; color: #e6eef8; }
.hero-title { font-size: 72px; line-height: 1; margin: 0 0 12px 0; font-weight: 800; letter-spacing: -1px; }
.hero-sub { color: #aab6c8; margin-bottom: 24px; }
.hero-actions { display: flex; gap: 12px; justify-content: center; }

.btn-primary {
  background: linear-gradient(90deg, #5b6bff, #7f9bff);
  color: white;
  padding: 12px 22px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
}

.btn-outline {
  border: 1px solid rgba(255,255,255,0.06);
  color: #cfd9e6;
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 600px) {
  .hero-title { font-size: 40px; }
  .hero-inner { padding: 0 12px; }
  .hero-actions { flex-direction: column; }
}
</style>