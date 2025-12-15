import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { CaptchaInfo } from '@/api/types/system/captcha';

// 获取验证码是否启用
export const getCaptchaStatus = () => {
  return http.get<boolean>(ADMIN_MODULE + `/captcha/status`, {});
};


