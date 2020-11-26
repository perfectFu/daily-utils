// 批量读取json文件，并替换文件内容
const fs = require('fs');
const path = require('path')
const util = require('util')
const stat = util.promisify(fs.stat)
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)


// 读取目录下的内容
const readDirFile = async (dir) => {
  // dir必须是绝对路径
  console.log('dir', dir);
  try {
    let ret = await stat(dir)
    if(!ret.isDirectory()) return;
    // 开始读取此目录下的bs开头的目录内容
    ret = await readdir(dir)
    // ret中包含目录下所有文件名称的数组
    ret = ret.filter(d => d.startsWith('bs'))
    // 遍历所有的文件，找到目录下面的config.json文件
    ret.forEach(async name => {
      const tempPath = path.resolve(dir, name +'/configs.json')
      console.log('开始处理---',tempPath);
      // 读取json文件内容
      if(tempPath.indexOf('bsSubmit')) {
        ret = await readFile(tempPath)

      }
      const json = JSON.parse(ret.toString())
      // 获取基本配置属性
      let attributes = json.attributes[0].attributes
      // 将基本属性中id为zindex的数据删掉
      // const index = attributes.findIndex(item => item.name === '层')
      // (index > -1) && attributes.splice(index, 1)
      // 将内容在此写入改文件中
      const data = new Uint8Array(Buffer.from(JSON.stringify(json, null, '\t')))
      fs.writeFile(tempPath, data, err => {
        if(err) throw err
        console.log(name +'/configs.json' + '文件以保存');
      })
    })
  } catch (error) {
    console.log(error);
  }
}


const rootDir = path.resolve('F:/web-code/cloud/widgets/floatPaste')
readDirFile(rootDir)