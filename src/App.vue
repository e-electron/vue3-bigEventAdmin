<script setup>
import zh from "element-plus/dist/locale/zh-cn.mjs";
</script>

<template>
  <div>
    <!-- 国际化处理 -->
     <el-config-provider :locale="zh">
       <router-view></router-view>
     </el-config-provider>
  </div>
</template>

<style scoped>

</style>
