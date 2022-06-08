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

6. Observer 的作用是什么?
  · 1. 分辨传入的对象value的类型，将传入的value做响应式处理。
  · 2. 响应式对象中动态属性的添加或者删除时，dep负责通知更新。

7. Observer类的构造函数中的dep的作用是什么(src/core/observer/index.js)?
  如果一个响应式对象里面要动态的添加或删除一个属性(Vue.set/delete), defineProperty方法是没有办法拦截的。既然没有办法拦截，谁去通知更新呢。
  所以此处dep的目的就是: 如果当前响应式对象的属性被删除了或者添加了新的属性，dep负责通知更新。
  包括数组里面有一个元素被删除或者添加进去了，都是通过该dep去通知的。

8. dep和watcher之间的依赖关系?
  只要有对象就会有Observer实例，一个Observer实例里面会有一个对应的dep，data对象里面的每个key也会对应一个dep，不管是对象发生了变化还是对象里面的属性发生了变化，都可以通过dep去通知更新。






































