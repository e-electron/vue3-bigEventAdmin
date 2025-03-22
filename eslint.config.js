import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      },
    },
  },
 
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  // {
  //   rules: {
  //     // 前置条件
  //     // 1. 禁格式化插件 prettier format on save 关闭
  //     // 2. 安装 Eslint 插件，并配置保存时自动修复 在设置里修改
  //     'prettier/prettier': [
  //       'warn',
  //       {
  //         singleQuote: 'true', // 单引号
  //         semi: false, // 无分号
  //         printWidth: 80, // 每行宽度至多80字符
  //         trailingComma: 'none', // 不加对象|数组最后逗号
  //         endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
  //       }
  //     ],
  //     // Eslint关注于规范，如果不符合规则，报错
  //     'vue/multi-word-component-names': [
  //       'warn',
  //       {
  //         ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
  //       }
  //     ],
  //     'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验（props丢失响应式）
  //     // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
  //     'no-undef': 'error'
  //   }
  // },
]
