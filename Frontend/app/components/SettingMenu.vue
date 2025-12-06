<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const from = route.query.from

function goPush(url: string) {
  router.push({
    path: `/settings${url}`,
    query: route.query
  })
}

function goBack() {
  if (typeof from === 'string') {
    router.push(decodeURIComponent(from))
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="setting-menu">
    <div class="menu-header">
      <button class="back-btn" @click="goBack">← 이전으로</button>
      <h3>설정</h3>
    </div>

    <ul class="menu-list">
      <li>
        <button @click="goPush('')" class="menu-item">기본 설정</button>
      </li>

      <li>
        <button @click="goPush('/profile')" class="menu-item">
          프로필 설정
        </button>
      </li>

      <li>
        <button @click="goPush('/security')" class="menu-item">
          보안 설정
        </button>
      </li>
    </ul>
  </div>
</template>
