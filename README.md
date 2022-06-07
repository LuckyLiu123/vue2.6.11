**Vue 源码分析**

目录
src
  |- compiler  编译器相关
  |- core  核心代码，要常来这里看看呀
    |- components  通用组件如 keep-alive
    |- global-api  全局API
    |- instance  构造函数等
    |- observer  响应式相关
    |- util
    |- vdom  虚拟DOM相关


  - scripts\config.js
    |- src\platforms\web\entry-runtime-with-compiler.js  打包的入口文件
      (该文件主要做处理template或者el选项，处理编译这件事)

整个程序的入口(初始化的流程)
  - src\platforms\web\runtime\index.js
    · 1. 安装补丁函数(更新函数): 将虚拟vdom 转换为真实dom
    · 2. 实现$mount方法: 将虚拟dom转换成真实dom并追加到宿主元素上(vdom -> dom -> append)
  - src\core\index.js
    · 1. 初始化全局静态API: Vue.set/delete/component/use/...
  - src\core\instance\index.js
    · 1. 构造函数的声明
    · 2. 各种实例属性和方法的声明
  - src\core\instance\init.js


1. 如果 new Vue() 中同时设置了 el, template, render, 代码如何执行?
  先去判断 render, 如果没有就去判断 template，如果还没有才去判断 el.

2. new Vue() 后面为什么可以不加 $mount()?
  在 src\core\instance\init.js 文件中自动执行了挂载。

3. $mount函数做了什么?

4. new Vue()都做了哪些事情?
  new Vue()的核心是: 初始化(得到渲染函数render)，最终目的是得到一个根实例，得到根实例之后是为了挂载$mout，挂载的内部会执行render函数，
  执行render函数之后会得到一个vdom，然后将vdom转换成真实dom(vdom转换成真实dom使用 patch(vdom) 函数)，最后再执行追加append，添加到真正的
  宿主元素上。这就是整个初始化的过程

5. render函数什么时候执行?













































