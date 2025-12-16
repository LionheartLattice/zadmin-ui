import {defineStore} from 'pinia';
import {ref} from 'vue';
import piniaPersistConfig from '@/stores/helper/persist';
import type {MenuInfo, UserInfo} from '@/api/types/system/login';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const userInfo = ref<UserInfo>({
    username: ''
  });
  const menuList = ref<MenuInfo[]>([]);

  function setToken(tokenStr: string) {
    token.value = tokenStr;
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
  }

  function setMenuList(menus: MenuInfo[]) {
    menuList.value = menus;
  }

  function clear() {
    token.value = '';
    userInfo.value = {
      username: ''
    };
    menuList.value = [];
  }

  return {
    token, userInfo, menuList, setToken, setUserInfo, setMenuList, clear
  };
}, {
  persist: piniaPersistConfig('user')
});
