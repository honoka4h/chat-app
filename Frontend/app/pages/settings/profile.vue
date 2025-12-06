<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'setting'
});

const auth = useAuthStore();

const username = await ref(auth.username);
const nickname = await ref(auth.nickname);
const config = useRuntimeConfig();

const file = ref<File | null>(null);

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const selectedFile = target.files[0];

    if (!selectedFile.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      file.value = null;
      target.value = '';
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert('파일 크기는 2MB 이하만 가능합니다.');
      file.value = null;
      target.value = '';
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        alert(`이미지 크기는 ${MAX_WIDTH}x${MAX_HEIGHT} 이하만 가능합니다.`);
        file.value = null;
        target.value = '';
        return;
      }
      file.value = selectedFile; // 조건 만족 시 파일 저장
    };
    img.src = URL.createObjectURL(selectedFile);
  }
};


const submit = async () => {
  const formData = new FormData();
  formData.append('username', username.value as string);
  formData.append('nickname', nickname.value as string);

  if (file.value) {
    formData.append('file', file.value);
  } else {
    formData.append('file', "default-avatar.png");
  }
  

  try {
    const res = await fetch(`${config.public.apiBase}/api/users/update`, {
      method: 'POST',
      body: formData
    });
    alert('프로필이 업데이트되었습니다.');
  } catch (error) {
    alert('프로필 업데이트에 실패했습니다.');
    return;
  }
};
</script>

<template>
  <h1>프로필 설정</h1>

  <form @submit.prevent="submit">
      <input v-model="nickname" type="text" placeholder="사용자 이름" />
      <input type="file" accept="image/*" @change="onFileChange"/>
              
      <button type="submit">
        전송
      </button>
  </form>

</template>