<template>
  <el-dialog v-model="dialogVisible" :title="title" :destroy-on-close="true" width="600px" draggable>
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="formData"
    >
      <el-form-item label="租户名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入租户名称" clearable />
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="formData.contactPerson" placeholder="请输入联系人" clearable />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" clearable />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入地址" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="过期时间" prop="expireTime">
        <el-date-picker
          v-model="formData.expireTime"
          type="datetime"
          placeholder="请选择过期时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance } from "element-plus";
import type { Tenant } from "@/api/types/system/tenant";
import { addTenant, updateTenant } from "@/api/modules/system/tenant";

const rules = reactive({
  name: [{ required: true, message: "请输入租户名称", trigger: "blur" }],
  contactPerson: [{ required: true, message: "请输入联系人", trigger: "blur" }],
  contactPhone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Tenant.TenantInfo>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const dialogVisible = ref(false);
const title = ref("");
const isView = ref(false);
const formData = ref<Partial<Tenant.TenantInfo>>({
  status: 1
});
const ruleFormRef = ref<FormInstance>();

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  title.value = params.title;
  isView.value = params.isView;
  formData.value = { ...params.row };
  // 如果是新增，设置默认状态
  if (!formData.value.id) {
    formData.value.status = 1;
  }
  dialogVisible.value = true;
};

const emit = defineEmits(["refresh"]);

const handleSubmit = async () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      if (formData.value.id) {
        await updateTenant(formData.value as Tenant.TenantInfo);
        ElMessage.success("编辑成功");
      } else {
        await addTenant(formData.value as Tenant.TenantInfo);
        ElMessage.success("新增成功");
      }
      dialogVisible.value = false;
      emit("refresh");
    } catch (error) {
      console.error(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

