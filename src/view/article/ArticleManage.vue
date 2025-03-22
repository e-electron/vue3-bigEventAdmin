<script setup>
import {Delete,Edit} from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import {artGetListService,artDleteService} from '@/api/article'
import { ref } from "vue";
import {formatTime} from '@/utils/format'
const articleList =ref([])
const total = ref(0)
const loading = ref(false)
const articleEditRef = ref()
const params = ref({
  pagenum:1,//当前页
  pagesize:5,//当前生效的每页条数
  cate_id:'',
  state:''
})

const getArticleList = async ()=>{
  // 发请求前loading状态打开
  loading.value = true
  // 记得传递的参数也要加.vale
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value=res.data.total
  // 接收到数据后loading状态关上
  loading.value=false
}
getArticleList()

// 添加文章
const onAddArticle = ()=>{
  articleEditRef.value.open({})
}
// 编辑文章
const onEditArticle=(row)=>{
  articleEditRef.value.open(row)
}
// 添加编辑成功的回调
const onSuccess = (type)=>{
  if(type==='add'){
    // 如果是添加 组好渲染当前页面是最后一页
    // 更新成最大页码数
    params.value.pagenum=Math.ceil((total.value+1)/params.value.pagesize)
  }
  getArticleList()
}
const onDelArticle=async (row)=>{
  try {
    await ElMessageBox.confirm(
    '你确认要删除吗?',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  await artDleteService(row.id)
  ElMessage.success('删除文章成功')
  getArticleList()
  } catch (error) {
    ElMessage.error(error.message?error.message:'取消删除');
  }
}

// 分页逻辑
const onSizeChange  = (size)=>{
  // console.log('页码变化了',page);
  // 只要使每页条数改变了，那么原本正在访问的当前页意义不大了，数据大概率已经不在原来那一页了
  // 重新从第一页渲染即可 不管此时在哪一页 都从第一页渲染
  params.value.pagenum=1
  params.value.pagesize=size
  // 基于最新的当前页 和 每页条数，渲染数据
  getArticleList()
}
const onCurrentChange = (page)=>{
// console.log('当前煤业条数',size);
// 更新当前页
params.value.pagenum=page
getArticleList()
}

// 搜索/重置逻辑
const onSearch =()=>{
  //按照最新的条件 重新检索 从第一页开始展示
  params.value.pagenum=1//重置页面
  getArticleList()
}
const onReset =()=>{
  // 将筛选条件清空 重新检索 从第一页开始检索
  params.value.pagenum=1
  params.value.cate_id=''
  params.value.state=''
  getArticleList()

}

</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    
    <!-- 表单区域 -->
     <!-- inline可以使el-form-item在一行展示 -->
     <el-form inline>
      <el-form-item label="文章分类：">
        <!-- 局部组件 -->
        <!-- vue2 => v-model :value & @input 简写 -->
        <!-- vue3 => v-model :modelValue & @update:modelValue 的简写 -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select style="width:150px" v-model="params.state">
          <!-- 这里的label和后台需要接收的value是一样的 就是中文标记 -->
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
     </el-form>

    <!-- 表格区域 -->
     <el-table :data="articleList" v-loading="loading">
       <el-table-column prop="title" label="文章标题">
        <!-- 利用作用域插槽 row 可以获取当前行的数据 =>v-for遍历的item -->
        <template #default="{row}">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
       </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{row}">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" #default="{row}">
        <el-button circle plain :icon="Edit" type="primary"  
        @click="onEditArticle(row)"></el-button>
        <el-button circle plain :icon="Delete" type="danger" 
        @click="onDelArticle(row)"></el-button>
      </el-table-column>
     </el-table>


     <!-- 分页区域 -->
     <!-- 在没加total之前 一直显示已弃用 -->
      <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2,3,4,5,10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px;justify-content: flex-end;"
      />

      <!-- 添加抽屉 -->
       <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>

  </page-container>

</template>