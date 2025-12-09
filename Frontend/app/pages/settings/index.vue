<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

const AuthStore = useAuthStore();

definePageMeta({
  layout: 'setting'
});

</script>

<template>
<h1>기본 설정</h1>
<p v-show="AuthStore.username">현재 사용자 아이디는 {{ AuthStore.username }}입니다.</p>
</template>