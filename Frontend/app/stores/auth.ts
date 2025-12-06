import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const username = ref<string | null>(null);
  const nickname = ref<string | null>(null);
  const userid = ref<string | null>(null);
  const loggedIn = ref(false);

  function setUser(name: string, id: string, nick: string) {
    username.value = name;
    nickname.value = nick;
    userid.value = id;
    loggedIn.value = !!name;
  }

  function clearUser() {
    username.value = null;
    nickname.value = null;
    userid.value = null;
    loggedIn.value = false;
  }

  return { username, userid, loggedIn, nickname, setUser, clearUser };
})
