import { defineStore } from 'pinia';
import { getAllBreadcrumbList, getFlatMenuList, getShowMenuList } from '@/utils';
import { computed, ref } from 'vue';
import { useUserStore } from './user';

// 转换后端菜单格式为前端格式
function convertMenuFormat(backendMenus: any[]): Menu.MenuOptions[] {
  if (!backendMenus || backendMenus.length === 0) {
    return [];
  }

  return backendMenus.map(menu => {
    const converted: Menu.MenuOptions = {
      id: menu.id?.toString() || '',
      pid: menu.pid?.toString() || '0',
      path: menu.path || '',
      name: menu.name || '',
      sort: menu.sort || 0,
      menuTypeCd: menu.menuTypeCd || '',
      component: menu.component || '',
      redirect: menu.redirect || '',
      permissions: menu.permissions || '',
      meta: {
        icon: menu.icon || '',
        title: menu.title || '',
        isLink: '',
        isHidden: menu.isHidden ? 'T' : 'F',
        isFull: menu.isFull ? 'T' : 'F',
        isAffix: menu.isAffix ? 'T' : 'F',
        isKeepAlive: 'F',
        useDataScope: 'F'
      },
      children: menu.children && menu.children.length > 0 ? convertMenuFormat(menu.children) : []
    };
    return converted;
  });
}

export const useAuthStore = defineStore('auth', () => {
  const isLoaded = ref(false);
  // 按钮权限列表
  const authButtonList = ref<string[]>([]);
  // 菜单权限列表
  const authMenuList = ref<Menu.MenuOptions[]>([]);
  // 用户角色列表. 以后如有业务需要可结合此属性灵活处理
  const authRoleList = ref<string[]>([]);
  // 当前页面的 router name，用来做按钮权限筛选
  const routeName = ref('');

  // 按钮权限列表
  const authButtonListGet = computed(() => authButtonList.value);
  // 菜单权限列表 ==> 这里的菜单没有经过任何处理
  const authMenuListGet = computed(() => authMenuList.value);
  // 用户角色列表
  const authRoleListGet = computed(() => authRoleList.value);
  // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHidden == true
  const showMenuListGet = computed(() => getShowMenuList(authMenuList.value));
  // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
  const flatMenuListGet = computed(() => getFlatMenuList(authMenuList.value));
  // 递归处理后的所有面包屑导航列表
  const breadcrumbListGet = computed(() => getAllBreadcrumbList(authMenuList.value));

  // Get AuthButtonList
  async function getAuthButtonList() {
    // 从菜单中提取按钮权限
    const buttons: string[] = [];
    const extractPermissions = (menus: Menu.MenuOptions[]) => {
      menus.forEach(menu => {
        if (menu.permissions) {
          // 按钮权限可能是逗号分隔的字符串
          const perms = menu.permissions.split(',').filter(p => p.trim());
          buttons.push(...perms);
        }
        if (menu.children && menu.children.length > 0) {
          extractPermissions(menu.children);
        }
      });
    };
    extractPermissions(authMenuList.value);
    authButtonList.value = buttons;
  }

  // Get AuthMenuList
  async function getAuthMenuList() {
    const userStore = useUserStore();

    // 从 userStore 获取登录时返回的菜单数据并转换格式
    authMenuList.value = convertMenuFormat(userStore.menuList);

    const beforeMenuList: Menu.MenuOptions[] = [
      {
        id: 'b6c6433509ab405f94796cc93752d417',
        pid: '0',
        path: '/system/message',
        name: 'Message',
        sort: 1,
        component: '/system/message/index',
        meta: {
          icon: 'Bell',
          title: '消息',
          isLink: '',
          isHidden: 'F',
          isFull: 'F',
          isAffix: 'F',
          isKeepAlive: 'F',
          useDataScope: 'F'
        },
        children: [],
        permissions: '',
        menuTypeCd: '1002002'
      },
      {
        id: '6abae64123b746808837ae61bf8d08fb',
        pid: '0',
        path: '/system/message/:id',
        name: 'MessagePopup',
        sort: 2,
        component: '/system/message/index',
        meta: {
          icon: 'Bell',
          title: '消息详情',
          isLink: '',
          isHidden: 'T',
          isFull: 'F',
          isAffix: 'F',
          isKeepAlive: 'F',
          useDataScope: 'F'
        },
        children: [],
        permissions: '',
        menuTypeCd: '1002002'
      }
    ];
    authMenuList.value.unshift(...beforeMenuList);

    const afterMenuList: Menu.MenuOptions[] = [
      {
        id: 'c6328b228c2c4e6bb5b1beb83110dcfa',
        pid: '0',
        path: '/demo',
        name: 'demo',
        sort: 500,
        component: '/demo/index',
        meta: {
          icon: 'Flag',
          title: '功能演示',
          isLink: '',
          isHidden: 'F',
          isFull: 'F',
          isAffix: 'F',
          isKeepAlive: 'F',
          useDataScope: 'F'
        },
        children: [],
        permissions: '',
        menuTypeCd: '1002002'
      },
      {
        id: 'c0a0eba2922346b0b8ae9d4dd951498e',
        pid: '0',
        path: '/about/index',
        name: 'about',
        sort: 600,
        component: '/about/index',
        meta: {
          icon: 'InfoFilled',
          title: '关于项目',
          isLink: '',
          isHidden: 'F',
          isFull: 'F',
          isAffix: 'F',
          isKeepAlive: 'F',
          useDataScope: 'F'
        },
        children: [],
        permissions: '',
        menuTypeCd: '1002002'
      }
    ];
    authMenuList.value.push(...afterMenuList);
  }

  // Get AuthRoleList
  async function getAuthRoleList() {
    const userStore = useUserStore();
    // 从用户信息中获取角色列表
    const roles = userStore.userInfo.roleList || [];
    authRoleList.value = roles.map((role: any) => role.roleName || role.permissions || '');
  }

  function clear() {
    isLoaded.value = false;
    authMenuList.value = [];
    authButtonList.value = [];
    authRoleList.value = [];
  }

  // Set RouteName
  async function setRouteName(name: string) {
    routeName.value = name;
  }

  async function setLoaded() {
    isLoaded.value = true;
  }

  return {
    isLoaded,
    setLoaded,
    routeName,
    authButtonListGet,
    authMenuListGet,
    authRoleListGet,
    showMenuListGet,
    flatMenuListGet,
    breadcrumbListGet,
    getAuthButtonList,
    getAuthMenuList,
    getAuthRoleList,
    setRouteName,
    clear
  };
});
