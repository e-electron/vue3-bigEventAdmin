<script setup>
import {ref} from 'vue'
import {artGetChannelsService,artDelChannelEdit} from '@/api/article.js'
import {Edit, Delete} from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
const dialog = ref()
const loading = ref(false)

const getChannelList = async ()=>{
  // 发请求前 有加载状态
  loading.value = true
  const res =  await artGetChannelsService()
  // channelList.value = []
  channelList.value = res.data.data
  // 发完请求后 接收到数据 关掉加载状态
  loading.value = false
}
getChannelList()

// 删除按钮
const onDeleteChannel= async (row)=>{
  try {
    await ElMessageBox.confirm('你确定要删除这个分类吗？','温馨提示',{
    type:'warning',
    confirmButtonText:'确认',
    cancelButtonText:'取消'
  })
  await artDelChannelEdit(row.id)
  ElMessage.success('删除成功')
  getChannelList()
  } catch (error) {
    ElMessage.error(error.message?error.message:'取消删除');
  }
}
// 编辑按钮
const onEditChannel=(row,)=>{
  dialog.value.open(row)
}
// 添加按钮
const onAddChannel = ()=>{
  dialog.value.open({})
}

// 编辑或添加后更新表格数据
const onSuccess = ()=>{
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>
    
    <!-- 主体表格部分 -->
     <el-table v-loading="loading" :data="channelList" style="width: 100%;">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="150">

        <!-- row 就是 channelList 的一项(一行),$index是下标 -->
        <template #default="{row,$index}">
          <el-button plain type="primary" circle @click="onEditChannel(row,$index)" :icon="Edit"></el-button>
          <el-button plain type="danger"  circle @click="onDeleteChannel(row,$index)" :icon="Delete"></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="赶快添加分类数据吧~" />
      </template>
     </el-table>

     <channel-edit @success="onSuccess" ref="dialog"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped>

</style>