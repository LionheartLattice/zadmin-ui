// 登录模块
export type CaptchaInfo = {
  backgroundImage: string;
  sliderImage: string;
  requestId: string;
  y: number;
  secretKey: string;
};
export type CaptchaVerifyImageParams = {
  requestId: string;
  moveX: number;
};

