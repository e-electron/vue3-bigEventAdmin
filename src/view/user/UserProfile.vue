<script setup>
import PageContainer from '@/components/PageContainer.vue'
import {ref} from 'vue'
import {useUserStore} from '@/stores'
import {userUpdateInfoService} from '@/api/user'
const formRef = ref()
// 在使用仓库中的初始值（无需响应式）解构没问题
const { user: { username, nickname, email, id },getUser} = useUserStore()
const userInfo = ref({ 
  id,
  username, 
  nickname, 
  email, 
  })
const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
})
const submitForm = async () => {
  // 等待表单验证通过
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(userInfo.value)
  // 更新仓库中的用户信息
  getUser()
  // 提示修改成功
  ElMessage.success('修改成功')
}
</script>

<template>
<page-container title="基本资料">
  <!-- 表单 -->
  <el-row>
    <el-col :span="12">
      <el-form
        :model="userInfo"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        size="large"
      >
        <el-form-item label="登录名称">
          <el-input v-model="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</page-container>
</template>