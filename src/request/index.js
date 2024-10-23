// 使用import.meta.glob方法导入model文件夹下的js文件
const files = import.meta.glob('./model/*.js')
const modules = {}
// 遍历files
for (const path in files) {
  // 获取文件名
  const moduleName = path.split('/').pop().replace('.js', '')
  // 获取文件内容
  files[path]().then(res => {
    // 挂载到modules
    modules[moduleName] = res.default
  })
}


// 导出
export default modules
