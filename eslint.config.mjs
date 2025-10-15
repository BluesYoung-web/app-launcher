/*
 * @Author: zhangyang
 * @Date: 2025-09-19 10:48:53
 * @LastEditTime: 2025-09-19 16:43:51
 * @Description:
 */
import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',

  // Enable stylistic formatting rules
  // stylistic: true,

  // Or customize the stylistic rules
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: 'single', // or 'double'
  },

  // TypeScript and Vue are autodetected, you can also explicitly enable them:
  typescript: {
    overrides: {
      'ts/explicit-function-return-type': 'off',
    },
  },

  ignores: ['README.md'],
})
