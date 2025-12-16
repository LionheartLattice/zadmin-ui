// 登录模块
export type LoginParams = {
  username: string;
  password: string;
  clientId: string;
  grantType: string;
  iv: string;
  requestId: string;
  moveX?: number;
};

export type LoginInfo = {
  name: string;
  avatar: string;
  introduction: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  userInfo: UserInfo;
  permissions: string[];
};


export type ChallengeInfo = {
  requestId: string; secretKey: string; backgroundImage: string; sliderImage: string; y: number;
};


// 菜单信息
export interface MenuInfo {
  id: string;
  pid: string;
  path: string;
  name: string;
  title: string;
  icon: string;
  component: string;
  redirect: string;
  sort: number;
  deep: number;
  menuTypeCd: string;
  permissions: string;
  isHidden: boolean;
  hasChildren: boolean;
  isLink: boolean;
  isFull: boolean;
  isAffix: boolean;
  children?: MenuInfo[];
}

// 角色信息
export interface RoleInfo {
  id: string;
  roleName: string;
  remark: string;
  permissions: string;
}

// 部门信息
export interface DeptInfo {
  id: string;
  name: string;
  pid: string;
  deep: number;
}

// 租户信息
export interface TenantInfo {
  id: string;
  name: string;
  managerUserPhone: string;
}

// 用户信息
export interface UserInfo {
  id?: string;
  username: string;
  phone?: string;
  nickname?: string;
  sex?: string;
  birthday?: string;
  logo?: string;
  idCard?: string;
  email?: string;
  deptList?: DeptInfo[];
  roleList?: RoleInfo[];
  tenant?: TenantInfo;
}

// 登录返回数据
export interface LoginResult {
  accessToken: string;
  id: string;
  username: string;
  phone?: string;
  nickname?: string;
  sex?: string;
  birthday?: string;
  logo?: string;
  email?: string;
  deptList?: DeptInfo[];
  roleList?: RoleInfo[];
  menuList?: MenuInfo[];
  tenant?: TenantInfo;
}

