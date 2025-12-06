<script setup lang="ts">
import UserCheck from '~/components/UserCheck.vue';
</script>

<template>
  <div class="app-root">
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">
          <NuxtLink to="/" class="brand-link">메신저</NuxtLink>
        </div>
        <nav class="nav-actions" aria-label="주요 링크">
          <NuxtLink to="/login" class="btn btn-ghost">로그인</NuxtLink>
          <NuxtLink to="/register" class="btn btn-ghost">회원가입</NuxtLink>
        </nav>
      </div>
    </header>

    <UserCheck />

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-about">
          <h4>메신저</h4>
          <p>최고의 편리함을 제공하는 메신저.</p>
        </div>

        <div class="footer-links">
          <a href="/terms">약관</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/contact">문의</a>
        </div>

        <div class="footer-contact">
          <p>© 2025 미니미니연</p>
          <p>운영자: 류온</p>
          <div class="social">
            <a href="#" aria-label="twitter">Twitter</a>
            <a href="#" aria-label="instagram">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:root {
  --bg: #0b0f14;
  --surface: #0f1720;
  --muted: #9aa6b6;
  --accent: #5b6bff;
}

.app-root {
  min-height: 100vh;
  background: var(--bg);
  color: #e6eef8;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.site-header {
  background: linear-gradient(90deg, rgba(11,15,20,0.95), rgba(15,20,26,0.95));
  border-bottom: 1px solid rgba(255,255,255,0.03);
}

.header-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-link {
  font-weight: 700;
  font-size: 1.125rem;
  color: inherit;
  text-decoration: none;
  letter-spacing: 0.4px;
}

.nav-actions { display: flex; gap: 12px; align-items: center; }

.btn {
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.04);
  color: var(--muted);
}

.btn-ghost:hover { border-color: rgba(91,107,255,0.95); color: #fff; transform: translateY(-1px); }

.site-main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 0; }

.site-footer {
  border-top: 1px solid rgba(255,255,255,0.02);
  padding: 28px 0;
}

.footer-inner {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-about h4 { margin: 0 0 6px 0; font-size: 1rem; }
.footer-links a { display: block; color: var(--muted); text-decoration: none; margin-bottom: 6px; }
.footer-contact p { margin: 0 0 6px 0; color: var(--muted); font-size: 0.95rem; }
.social a { margin-right: 8px; color: var(--muted); text-decoration: none; font-size: 0.95rem; }

@media (max-width: 600px) {
  .header-inner { padding: 0 8px; }
  .footer-inner { flex-direction: column; gap: 12px; }
}
</style>