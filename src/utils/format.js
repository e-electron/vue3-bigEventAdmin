// 标准化日期函数的封装
import {dayjs} from 'element-plus'

export const formatTime = (time)=>dayjs(time).format('YYYY年MM月DD日')

