<script setup lang="ts">
import UserCheck from '~/components/UserCheck.vue';
import '~/assets/css/default-layout.css';
</script>

<template>
  <div class="default-layout">
    <header class="default-header">
      <nav class="default-nav">
        <div class="nav-left">
          <NuxtLink to="/">메신저</NuxtLink>
        </div>
        <div class="nav-right">
          <NuxtLink to="/login">로그인</NuxtLink>
          <NuxtLink to="/register">회원가입</NuxtLink>
        </div>
      </nav>
    </header>

    <UserCheck />

    <main class="site-main">
      <slot />
    </main>

    <footer class="default-footer">
      <div class="footer-about">
        <h4>메신저</h4>
        <p>최고의 편리함을 제공하는 메신저.</p>
      </div>

      <div class="footer-links">
        <a href="/privacy">개인정보처리방침</a>
      </div>

      <div class="footer-contact">
        <p>© 2025 미니미니연</p>
        <div class="social">
          <a href="#" aria-label="twitter">Twitter</a>
          <a href="#" aria-label="instagram">Instagram</a>
        </div>
      </div>
    </footer>
  </div>
</template>