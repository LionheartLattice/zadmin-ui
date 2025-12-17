import type { IPage, IResult, IResultData } from "@/api/types";
import type { Tenant } from "@/api/types/system/tenant";
import http from "@/api";

/**
 * @name 租户管理模块
 */

// 获取租户列表
export const getTenantList = (params: Tenant.ReqTenantPage) => {
  return http.post<IPage<Tenant.TenantInfo>>("/tenant/page", params);
};

// 新增租户
export const addTenant = (params: Tenant.TenantInfo) => {
  return http.post<IResult>("/tenant/add", params);
};

// 编辑租户
export const updateTenant = (params: Tenant.TenantInfo) => {
  return http.post<IResult>("/tenant/update", params);
};

// 删除租户
export const deleteTenant = (ids: string[]) => {
  return http.post<IResult>("/tenant/delete", ids);
};

// 获取租户详情
export const getTenantById = (id: string) => {
  return http.post<IResultData<Tenant.TenantInfo>>("/tenant/getById", { id });
};

