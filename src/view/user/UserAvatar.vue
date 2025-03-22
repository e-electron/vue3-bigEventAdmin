<script setup>
import PageContainer from '@/components/PageContainer.vue'
import {ref} from 'vue'
import {Plus,Upload} from '@element-plus/icons-vue'
import {useUserStore} from '@/stores'
import { userUpdateAvatarService } from "@/api/user";
// 基于store中的用户信息初始化imgUrl头像
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
// 给按钮绑定ref对象 触发按钮的时候 上传图片
const uploadRef = ref()
const onSelectFile = (uploadFile) => {
  // 基于FileReader对象读取图片做预览
  const reader = new FileReader();
  reader.readAsDataURL(uploadFile.raw);
  reader.onload = () => {
    imgUrl.value = reader.result;
  };
}

const loading = ref(false)
const onUpdateAvatar = async () => {
  loading.value = true
  try {
    // 发送请求更新头像
  await userUpdateAvatarService(imgUrl.value);
  // 更新仓库中的用户信息
  await userStore.getUser();
  // 提示修改成功
  ElMessage.success('修改成功')
  } catch (error) {
    ElMessage.error('修改失败: ' + error.message);
  }
  loading.value = false
}
</script>

<template>
<page-container v-loading="loading" title="更换头像">
  <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false"
  :on-change="onSelectFile"
  ref="uploadRef">
    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>

  <br>
  <el-button  type="primary" size="large" :icon="Plus" 
  @click="uploadRef.$el.querySelector('input').click()"
  >选择图片</el-button>
  <el-button @click="onUpdateAvatar" type="success"  
  size="large" :icon="Upload">上传图像</el-button>
</page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>