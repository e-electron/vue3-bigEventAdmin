<script setup>
defineProps({
  title:{
    required:true,
    type:String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{title}}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>

    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  // border-box 让盒子不会再受到边框和内边距的增加而改变，
  // 即使添加了边框和内边距，元素在页面上的占据空间大小也会保持不变
  box-sizing: border-box;
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>