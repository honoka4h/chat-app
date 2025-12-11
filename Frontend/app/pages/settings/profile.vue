<script lang="ts" setup>
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'setting'
});

const auth = useAuthStore();
const router = useRouter();

const userid = await ref<number | null>(auth.userid);
const username = await ref<string | null>(auth.username);
const nickname = await ref<string | null>(auth.nickname);
const file = await ref<File>();
const config = useRuntimeConfig();

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFiles = target.files;

  if (!selectedFiles || selectedFiles.length === 0) return;
  if (!selectedFiles[0]) return;
  
  if (selectedFiles.length > 1) {
    alert("파일은 한 개만 넣을 수 있습니다.");
    target.value = '';
    return;
  };

  if (!selectedFiles[0].type.startsWith("image/")) {
    alert("이미지 파일만 업로드 가능합니다.");
    target.value = '';
    return
  }

  const maxSize = 2 * 1024 * 1024
  if (selectedFiles[0].size > maxSize) {
    alert("2MB 이하 파일만 업로드 가능합니다.");
    target.value = '';
    return
  }

  file.value = selectedFiles[0];
}

async function submit() {
  if (!username.value || !userid.value) {
    alert("로그인 후 이용해주세요.");
    router.push("/");
    return;
  }

  if (!nickname.value || nickname.value.length < 1) {
    alert("닉네임을 입력해주세요.");
    return;
  }

  if (!file.value) {
    alert("파일을 추가하세요.")
    return
  }

  try {
    const formData = new FormData();
    formData.append('userid', String(userid.value));
    formData.append('username', username.value);
    formData.append('nickname', nickname.value);
    formData.append('file', file.value);

    const data : any = await $fetch(`${config.public.apiBase}/api/users/update`, {
        method: "POST",
        credentials: 'include',
        body: formData
    });

    console.log(data)

    if (data && data.ok) {
      auth.setNick(nickname.value);
      console.log(auth.nickname);
      alert("성공적으로 프로필을 업데이트 했습니다. 새로고침을 하시면 변경사항이 적용됩니다.");
    } else {
      alert("업데이트에 실패했습니다.");
    };
  } catch(error : any) {
    alert(error?.data?.message || "오류가 발생했습니다, 다시 시도해주세요.");
  }

}
</script>

<template>
  <h1>프로필 설정</h1>

  <form @submit.prevent="submit">
      <input v-model="nickname" type="text" placeholder="사용자 이름" />
      <input type="file" name="file" accept="image/*" @change="handleFileChange" />
              
      <button type="submit">
        전송
      </button>
  </form>

</template>