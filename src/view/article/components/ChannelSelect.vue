<script setup>
import {ref} from 'vue'
import {artGetChannelsService} from '@/api/article'
const ChannelList = ref([])
const getChannelList = async ()=>{
  const res =  await artGetChannelsService()
  ChannelList.value = res.data.data
  // console.log(ChannelList.value);
  
}
getChannelList()

defineProps({
  modelValue:{
    type:[Number,String]
  }
})
const emit = defineEmits(['update:modelValue'])

</script>

<template>
  <el-select style="width:150px" 
  :modelValue="modelValue"
  @update:modelValue="emit('update:modelValue',$event)">
    <!-- label是展示给用户看的 再下拉菜单里显示 -->
    <!-- value是传递给后台的值 和label是一一对应的 有时候是一样的 -->
    <el-option v-for="channel in ChannelList" 
    :key="channel.id" 
    :label="channel.cate_name" 
    :value="channel.id"
    ></el-option>
  </el-select>
</template>