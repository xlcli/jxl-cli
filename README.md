# jxl-cli

## 用法

```shell
npm install -g jxl-cli
```

## 作用

`jxl create <project-directory>` react 支持部署到配置文件里指定服务器的指定目录下；
egg 将 react 和 eggjs 添加到一起。

## 命令行

```json
Usage: jxl <command> [options]

Options:
  -v, --version  version
  -h, --help     display help for command

Commands:
  version        version
  help           output usage information
  create         create a new project from a template
  deploy         deploy project
  push           push project
  branch         checkout new branch
  merge          master merge branch
Usage:
  - jxl version
  - jxl help
  - jxl create [projectName]
  - jxl deploy
  - jxl push
  - jxl branch
  - jxl merge

Examples:
  $ jxl --help
  $ jxl --version
```

## 命令使用

### jxl create [projectName]

可选择如下模版：

- react template
- react ts template
- react library template
- react library ts template
- react ui template
- react vite template
- react vite ts template
- egg template

### jxl branch

创建新的分支，并同时修改 package.json 的 version 值，分支会分成三种类型（x.y.z）：

- patch: Bug 修复 - 增加 z
- minor: 向下兼容的功能性新增 - 增加 y
- major: 破坏性更新，不向下兼容 - 增加 x

### jxl push

`jxl push` 会提交到当前正在工作的分支，如果没有，则默认提交到 master 上，建议先进行 `git init` 和 `git remote` 操作

### jxl merge

执行 jxl push 操作后，会获取当前分支，并切换到 master 分支，merge 当前分支的代码

### jxl deploy

根据 `config/server.js` 文件的配置进行部署，如果配置文件是：

```js
module.exports = {
  projectName: '',
  template: 'react',
  buildPath: 'build',
  script: 'npm run build',
  host: '', // 服务器地址
  port: 22, // ssh 端口，一般是 22
  username: 'root', // 登录服务器用户名
  password: '', // 登录服务器密码
  serverPath: '/usr/src/my-app', // 文件上传的服务器地址
}
```

直接执行 `jxl deploy` 就可以，如果是下面这样：

```js
module.exports = {
  pre: {
    projectName: '',
    template: 'react',
    buildPath: 'build',
    script: 'npm run build',
    host: '', // 服务器地址
    port: 22, // ssh 端口，一般是 22
    username: 'root', // 登录服务器用户名
    password: '', // 登录服务器密码
    serverPath: '/usr/src/my-app', // 文件上传的服务器地址
  },
  online: {
    projectName: '',
    template: 'react',
    buildPath: 'build',
    script: 'npm run build',
    host: '', // 服务器地址
    port: 22, // ssh 端口，一般是 22
    username: 'root', // 登录服务器用户名
    password: '', // 登录服务器密码
    serverPath: '/usr/src/my-app', // 文件上传的服务器地址
  },
}
```

则执行 `jxl deploy pre` 或 `jxl deploy online` 对应到相应的配置。
