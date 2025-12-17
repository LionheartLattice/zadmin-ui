<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :data-callback="dataCallback"
      :init-param="initParam"
      :request-api="getTenantList"
      :search-columns="searchColumns"
      title="租户列表"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="{ isSelected, selectedListIds }">
        <el-button :icon="CirclePlus" type="primary" @click="openDrawer('新增')">新增租户</el-button>
        <el-button :disabled="!isSelected" :icon="Delete" plain type="danger" @click="batchDelete(selectedListIds)">
          批量删除
        </el-button>
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button :icon="EditPen" link type="primary" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button :icon="Delete" link type="primary" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <TenantForm ref="drawerRef" @refresh="proTable?.getTableList()"/>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import type {Tenant} from "@/api/types/system/tenant";
import type {ColumnProps, ProTableInstance, SearchProps} from "@/components/ProTable/interface";
import {CirclePlus, Delete, EditPen} from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import TenantForm from "./components/TenantForm.vue";
import {deleteTenant, getTenantList} from "@/api/modules/system/tenant";
import {ElMessage, ElMessageBox} from "element-plus";

defineOptions({
  name: "tenantManage"
});

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，可以在这里定义
const initParam = reactive({});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total,
    pageNum: data.current,
    pageSize: data.limit
  };
};

// 表格配置项
const columns: ColumnProps<Tenant.TenantInfo>[] = [
  {type: "selection", fixed: "left", width: 80},
  {type: "index", label: "#", width: 80},
  {prop: "name", label: "租户名称"},
  {prop: "contactPerson", label: "联系人"},
  {prop: "contactPhone", label: "联系电话"},
  {prop: "address", label: "地址"},
  {
    prop: "status",
    label: "状态",
    enum: [
      {label: "正常", value: 1},
      {label: "禁用", value: 0}
    ],
    render: scope => {
      return scope.row.status === 1 ? "正常" : "禁用";
    }
  },
  {prop: "expireTime", label: "过期时间"},
  {prop: "createTime", label: "创建时间"},
  {prop: "operation", label: "操作", fixed: "right", width: 200}
];

// 搜索配置项
const searchColumns: SearchProps[] = [
  {prop: "name", label: "租户名称", el: "input"},
  {prop: "contactPerson", label: "联系人", el: "input"},
  {prop: "contactPhone", label: "联系电话", el: "input"},
  {
    prop: "status",
    label: "状态",
    el: "select",
    enum: [
      {label: "正常", value: 1},
      {label: "禁用", value: 0}
    ]
  }
];

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof TenantForm> | null>(null);
const openDrawer = (title: string, row: Partial<Tenant.TenantInfo> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: {...row},
    api: title === "新增" ? undefined : undefined, // api is handled in form
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 删除租户
const deleteAccount = async (params: Tenant.TenantInfo) => {
  ElMessageBox.confirm(`是否确认删除租户名称为"${params.name}"的数据项?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteTenant([params.id]);
    ElMessage.success("删除成功！");
    proTable.value?.getTableList();
  });
};

// 批量删除
const batchDelete = async (ids: (string | number)[]) => {
  ElMessageBox.confirm(`是否确认删除选中数据?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    await deleteTenant(ids as string[]);
    ElMessage.success("删除成功！");
    proTable.value?.getTableList();
    proTable.value?.clearSelection();
  });
};
</script>
