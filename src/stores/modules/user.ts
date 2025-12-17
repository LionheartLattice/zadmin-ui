import {defineStore} from 'pinia';
import {ref} from 'vue';
import piniaPersistConfig from '@/stores/helper/persist';
import type {MenuInfo, UserInfo} from '@/api/types/system/login';
import {getCurrentUserApi} from '@/api/modules/system/login';

export const useUserStore = defineStore('user', () => {
  const token = ref('');
  const userInfo = ref<UserInfo>({
    username: ''
  });
  const menuList = ref<MenuInfo[]>([]);
  const needRefresh = ref(true);

  function setToken(tokenStr: string) {
    token.value = tokenStr;
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info;
    needRefresh.value = false;
  }

  function setMenuList(menus: MenuInfo[]) {
    menuList.value = menus;
  }

  async function fetchCurrentUser() {
    try {
      console.log('开始调用 getCurrentUserApi...');
      const {data} = await getCurrentUserApi();
      console.log('getCurrentUserApi 调用成功', data);
      const userInfoData: UserInfo = {
        id: data.id,
        username: data.username,
        phone: data.phone,
        nickname: data.nickname,
        sex: data.sex,
        birthday: data.birthday,
        logo: data.logo,
        email: data.email,
        deptList: data.deptList,
        roleList: data.roleList,
        tenant: data.tenant
      };
      setUserInfo(userInfoData);
      if (data.menuList && data.menuList.length > 0) {
        setMenuList(data.menuList);
      }
      needRefresh.value = false;
      return true;
    } catch (error) {
      clear();
      return false;
    }
  }

  function clear() {
    token.value = '';
    userInfo.value = {
      username: ''
    };
    menuList.value = [];
    needRefresh.value = true;
  }

  return {
    token, userInfo, menuList, needRefresh, setToken, setUserInfo, setMenuList, fetchCurrentUser, clear
  };
}, {
  persist: piniaPersistConfig('zadmin-user', ['token', 'userInfo', 'menuList'])
});
