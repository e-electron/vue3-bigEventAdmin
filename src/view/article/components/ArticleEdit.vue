<script setup>
import {ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import ChannelSelect from './ChannelSelect.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {artPublishService,artGetDetailService,artEditService} from '@/api/article'
import {nextTick} from 'vue'
import { baseURL } from "@/utils/request";
import axios from 'axios'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
//默认数据
const defaultForm = ref({
  title:'',//标题
  cate_id:'',//分类id
  cover_img:'',//封面图片 file 对象
  content:'',//string 内容
  state:''//状态
})
// 准备数据
const formModel = ref({...defaultForm.value})

// 组件对外暴露一个方法 open 基于open传来的参数 区分添加还是编辑
// open({}) 表单无需渲染 说明是添加
// open({is,..._}) 说明是表单编辑 表单需要渲染
// open调用后 打开抽屉
const formRef = ref()
const editorRef = ref(null)
const open = async (row) =>{
  await nextTick() // 等待 DOM 更新
  visibleDrawer.value=true
  if(row.id){
    // 编辑 需要基于id发送请求 获取编辑的文章对应的详情数据 进行回显
    formModel.value={...row}
    const res = await artGetDetailService(row.id)
    formModel.value=res.data.data
    editorRef.value.setHTML(res.data.data.content||'')
    // console.log(formModel.value);
    // 图片单独回显 拼上地址头
    imgUrl.value=baseURL+formModel.value.cover_img
    // 注意提交给后台 需要的数据格式 是file 对象格式
    // 需要将网络图片地址 转换成file对象 存储起来 以便使用
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value,formModel.value.cover_img)
  } else {
    // 添加文章:先清空数据 避免造成污染:
    // 重置了表单数据 但富文本 图片上传img地址 都要手动重置
    imgUrl.value=''
    formModel.value={...defaultForm.value}
    nextTick(()=>{
      editorRef.value.setHTML('')
    })
  }
}
// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;
    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] });
    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error);
    throw error;
  }
}

// 图片上传相关逻辑
const imgUrl = ref('')
// 选择图图片
const onSelectFile = (uploadFile)=>{
  // uploadFile是默认参数 里边的raw包含选中图片的地址
  imgUrl.value = URL.createObjectURL(uploadFile.raw)//来预览图片
  // 立刻加班费图片对象 存入到formModel.value,cover_img将来用于提交
  formModel.value.cover_img = uploadFile.raw
}
// 新增内容更新处理器
const handleContentUpdate = (content) => {
  formModel.value.content = content
}
const emit = defineEmits(['success'])
const loading = ref(false)
// 提交
const onPublish = async (state)=>{
  loading.value = true
  try {
   // 将已发布还是草稿状态 存入formModel
  formModel.value.state=state
  // console.log(formModel.value);
  // 注意:当前接口 需要的是formData对象
  // 将普通对象=>转换为formData对象
  const fd = new FormData()
  for(let key in formModel.value){
    fd.append(key, formModel.value[key])
  }
  // 发请求前 判断是编辑还是添加
  if(formModel.value.id){
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('编辑成功')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
  }
  visibleDrawer.value = false
  // 通知父组件 添加成功 并且告知是编辑还是添加
  emit('success',formModel.value.id ? 'edit' : 'add')
  } catch (error) {
    ElMessage.error(error.message);
  }
  loading.value = false
}

// 暴露出open给父组件调用
defineExpose({
  open
})
</script>


<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form v-loading="loading" :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          style="width:100%"
        ></channel-select>
        <!-- 文章封面组件 -->
      </el-form-item>
      <!-- 
      此出需要关闭elment-plus 的自动上出纳 不需要配置action等参数
      只需要做前端的本地预览图片即可 无需再提交前上传图标
      本地预览语法:URL.createObjectURL(文件地址)床架本地预览的地址来预览
      -->
      <!-- 
      :auto-upload:是否自动上传
      :on-change:图片发生变化触发事件
      v-if="imgUrl":有图上传本地预览图片
      plus:未添加图片时显示＋
      -->
      <el-form-item label="文章封面" prop="cover_img"> 
        <el-upload
        class="avatar-uploader"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="onSelectFile"
      >
        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>  
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <!-- 富文本 -->
          <quill-editor  ref="editorRef"
          theme="snow"
          :content="formModel.content"
          @update:content="handleContentUpdate"
          content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>