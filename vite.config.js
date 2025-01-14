import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
// 宏（语法糖）库
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import postcsspxtoviewport from 'postcss-px-to-viewport'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ReactivityTransform(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          // 要转化的单位
          unitToConvert: 'px',
          // UI设计稿的大小
          viewportWidth: 375,
          // 转换后的精度
          unitPrecision: 6,
          // 转换后的单位
          viewportUnit: 'vw',
          // 字体转换后的单位
          fontViewportUnit: 'vw',
          // 能转换的属性，*表示所有属性，!border表示border不转
          propList: ['*'],
          // 指定不转换为视窗单位的类名，
          selectorBlackList: ['ignore-'],
          // 最小转换的值，小于等于1不转
          minPixelValue: 1,
          // 是否在媒体查询的css代码中也进行转换，默认false
          mediaQuery: false,
          // 是否转换后直接更换属性值
          replace: true,
          // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          exclude: [],
          // 包含那些文件或者特定文件
          include: [],
          // 是否处理横屏情况
          landscape: false
        })
      ]
    }
  },
  server: {
    proxy: {
      '/api/machine': {
        target: 'https://z-office.zhuritec.com/api/machine',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/machine/, '')
      },
      '/api/verCode': {
        target: 'https://z-office.zhuritec.com/api/verCode',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/verCode/, '')
      },
      '/api/yibum': {
        target: 'http://139.196.7.72:8765/api/yibum',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yibum/, '')
      },
      '/api/workorder': {
        target: 'https://welfare.zhuritec.com/api/workorder',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/workorder/, '')
      },
      '/api/auth/jwt/token': {
        target: 'http://58.215.206.250:7776/api/auth/jwt/token',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth\/jwt\/token/, '')
      },
      '/api/myStyle': {
        target: 'http://58.215.206.250:8190/api/myStyle',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myStyle/, '')
      },
      '/api/sys': {
        target: 'http://58.215.206.250:8190/api/sys',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sys/, '')
      },
      '/api/officeSuppliesApplication': {
        target: 'https://welfare.zhuritec.com/api/officeSuppliesApplication',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/officeSuppliesApplication/, '')
      },
      // 我的集团oa员工发送验证码，用于系统登录
      '/api/admin': {
        target: 'http://58.215.206.250:7776/api/admin',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin/, '')
      },
      // 我的集团oa员工手机号+验证码，用于系统登录
      '/api/auth/jwt/phone/byCode': {
        target: 'http://58.215.206.250:7776/api/auth/jwt/phone/byCode',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth\/jwt\/phone\/byCode/, '')
      },
      // 我的集团--获取头像
      '/api/baseFile': {
        target: 'http://58.215.206.250:7776/api/baseFile',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/baseFile/, '')
      },
      // 我的集团--获取员工信息
      '/api/oa/user/apply/card': {
        target: 'http://58.215.206.250:7776/api/oa/user/apply/card',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oa\/user\/apply\/card/, '')
      },
      // 我的集团--获取员工信息二维码
      '/api/oa/personnelArchives': {
        target: 'http://58.215.206.250:7776/api/oa/personnelArchives',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oa\/personnelArchives/, '')
      },
      // 我的集团--获取公司信息
      '/api/oa/sysExternalOrg/read/': {
        target: 'http://58.215.206.250:7776/api/oa/sysExternalOrg/read',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oa\/sysExternalOrg\/read/, '')
      },
      // oa员工证登录接口
      '/api/auth/jwt/staff': {
        target: 'https://oa.zhuritec.com/api/auth/jwt/staff',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth\/jwt\/staff/, '')
      },
      // 年会排行榜
      '/erp_api': {
        target: 'https://businessbbs.zhuritec.com/erp_api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/erp_api/, '')
      },
      // 验证当前人员是否是优秀员工
      // 报名优秀员工体检
      // 优秀员工体检查询列表
      // 优秀员工体检报名详情
      '/api/oa': {
        target: 'https://oa.zhuritec.com/api/oa',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oa/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
