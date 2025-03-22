<script setup>
import {ref} from 'vue'
import {artEditChannelService,artAddChannelService} from '@/api/article.js'
const dialogVisible = ref(false)
// 预校验
const formRef = ref()
const formModel = ref({
  cate_name:'',
  cate_alias:''
})
const rules = ref({
  cate_name:[
    {required:true,message:'请输入分类名称',trigger:'blur'},
    {pattern:/^\S{1,10}$/,message:'必须是1-10的非空字符',trigger:'blur'}
  ],
  cate_alias:[
    {required:true,message:'请输入别名名称',trigger:'blur'},
    {pattern:/^[a-zA-Z0-9]{1,15}/,message:'必须是1-15位的字母或数字',trigger:'blur'}
  ]
})

// 组件对外暴露一个方法 open 基于open传来的参数 区分添加还是编辑
// open({}) 表单无需渲染 说明是添加
// open({is,cate_name.cate_}) 说明是表单编辑 表单需要渲染
// open调用后 打开弹层弹窗
const open = (row)=>{
  // console.log(row);
  dialogVisible.value=true
  formModel.value={...row}//添加-->充值了表单内容，编辑---->存储了需要回显的数据
}
// 向外暴露
defineExpose({
  open
})

// 给父组件传递
const emit = defineEmits(['success'])
const onSubmit = async ()=>{
  // 预校验
  await formRef.value.validate()
  const isEdit = formModel.value.id
  // id存在 编辑提交
  if(isEdit){
    await artEditChannelService(formModel.value)
  } else {
    // id不存在 添加的提交
    await artAddChannelService(formModel.value)
  }
  dialogVisible.value=false
  // 给父组件传递触发事件
  // 如果需要区分是编辑还是添加需要传递isEdit参数给父组件
  emit('success')
  ElMessage.success(isEdit?'编辑成功':'添加成功')
}

</script>

<template>
    <el-dialog v-model="dialogVisible" :title="formModel.id?'编辑分类':'添加分类'" width="30%">
    <!-- <div>渲染表单</div> -->
     <el-form label-width="100px" style="padding-right:30px"
     :model="formModel" :rules="rules" ref="formRef">

      <el-form-item prop="cate_name" label="分类名称">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item prop="cate_alias" label="分类别名">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名"></el-input>
      </el-form-item>

     </el-form>



    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确认
        </el-button>
      </span>
    </template>
    </el-dialog>
</template>