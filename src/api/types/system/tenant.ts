import type { IPageQuery } from "@/api/types";

export namespace Tenant {
  export interface TenantInfo {
    id: string;
    name: string;
    contactPerson: string;
    contactPhone: string;
    address: string;
    status: number; // 1: 正常, 0: 禁用
    expireTime: string;
    remark: string;
    createTime: string;
    updateTime: string;
  }

  export interface ReqTenantPage extends IPageQuery {
    name?: string;
    contactPerson?: string;
    contactPhone?: string;
    status?: number;
  }
}

